import { Ratelimit } from "@upstash/ratelimit";
import redis from "../../utils/redis";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Replicate from "replicate";


// Create a new ratelimiter, that allows 5 requests per 24 hours
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.fixedWindow(2, "1440 m"),
      analytics: true,
    })
  : undefined;



const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY ? process.env.REPLICATE_API_KEY : "",
});

export async function POST(request: Request) {


  // Rate Limiter Code
  if (ratelimit) {
    const headersList = headers();
    const ipIdentifier = headersList.get("x-real-ip");

    const result = await ratelimit.limit(ipIdentifier ?? "");

    if (!result.success) {
      return new Response(
        "Too many uploads in 1 day. Please try again in a 24 hours.",
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": result.limit,
            "X-RateLimit-Remaining": result.remaining,
          } as any,
        }
      );
    }
  }

  const { imageUrl, resolution, finalPrompt } = await request.json();

  // POST request to Replicate to start the image generation process
   
  const enhancedFinalPrompt=`${finalPrompt} with many exquisite decorations+ around it-, creating an elegant and sophisticated atmosphere`
  console.log(enhancedFinalPrompt)
  const reqObj = {
    version: "92588c5d6edf4a743ea4f11200b4ffce1c1370c8c8be51357bf514f10f02fc82",
    input: {
      image_path: imageUrl,
      prompt:enhancedFinalPrompt,
      negative_prompt:"low quality, out of frame, illustration, 3d, sepia, painting, cartoons, sketch, watermark, text, Logo, advertisement",
      api_key:process.env.OPENAI_API_KEY,
      pixel: resolution ? resolution : '512 * 512',
      guidance_scale:7.5,
      scale:3,
      num_inference_steps:20,
      manual_seed:-1,
      product_size:"0.5 * width"
    }
  }

  const startResponse = await replicate.predictions.create(reqObj);

  let endpointUrl = startResponse.urls.get;
  console.log(`endpointUrl-----${JSON.stringify(endpointUrl)}`)

  return NextResponse.json(
    endpointUrl ? endpointUrl : "Failed to generate image"
  );
}
