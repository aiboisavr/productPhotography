import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { imageUrl,  } = await request.json();

    let endpointUrl = imageUrl

    let jsonFinalResponse
    console.log("polling for result...");
    let finalResponse = await fetch(endpointUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + process.env.REPLICATE_API_KEY,
        },
    });
    
    jsonFinalResponse = await finalResponse.json();
    console.log(jsonFinalResponse)

    return NextResponse.json(
        jsonFinalResponse ? jsonFinalResponse : {}
    )
}