import { Ratelimit } from "@upstash/ratelimit";
import redis from "../../utils/redis";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export async function POST(request: Request) {

  const { imageUrl, resolution, finalPrompt } = await request.json();

  // POST request to Replicate to start the image generation process

  const reqObj = {
    version: "92588c5d6edf4a743ea4f11200b4ffce1c1370c8c8be51357bf514f10f02fc82",
    input: {
      image_path: imageUrl,
      prompt: finalPrompt,
      negative_prompt:"low quality, out of frame, illustration, 3d, sepia, painting, cartoons, sketch, watermark, text, Logo, advertisement",
      api_key:process.env.OPENAI_API_KEY,
      pixel: resolution ? resolution : '512 * 512'
    }
  }

  const startResponse = await replicate.predictions.create(reqObj);

  let endpointUrl = startResponse.urls.get;

  // GET request to get the status of the image restoration process & return the result when it's ready
  let restoredImage: string | null = null;
  while (!restoredImage) {
    // Loop in 1s intervals until the alt text is ready
    console.log("polling for result...");
    let finalResponse = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_KEY,
      },
    });
    let jsonFinalResponse = await finalResponse.json();

    if (jsonFinalResponse.status === "succeeded") {
      restoredImage = jsonFinalResponse.output;
    } else if (jsonFinalResponse.status === "failed") {
      break;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return NextResponse.json(
      restoredImage ? restoredImage : "Failed to generate image"
  );
}
