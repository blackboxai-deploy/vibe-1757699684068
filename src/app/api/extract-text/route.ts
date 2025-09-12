import { NextRequest, NextResponse } from 'next/server';

const API_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const API_HEADERS = {
  'CustomerId': 'cus_T2gEmLB5ziI0mi',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx'
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { image, fileName } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    // Prepare the AI request
    const aiRequest = {
      model: 'openrouter/claude-sonnet-4',
      messages: [
        {
          role: 'system',
          content: 'You are an advanced OCR system. Extract all visible text from images with high accuracy. Return only the extracted text content without additional commentary, explanations, or formatting. If no text is found, respond with "No text detected in the image."'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please extract all visible text from this image. Return only the text content without any additional commentary.'
            },
            {
              type: 'image_url',
              image_url: {
                url: image
              }
            }
          ]
        }
      ]
    };

    console.log('Making request to AI API for file:', fileName);

    // Make request to OpenRouter API
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(aiRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: `AI service error: ${response.status}` },
        { status: 500 }
      );
    }

    const aiResponse = await response.json();
    const extractedText = aiResponse.choices?.[0]?.message?.content;

    if (!extractedText) {
      return NextResponse.json(
        { success: false, error: 'No text could be extracted from the image' },
        { status: 500 }
      );
    }

    const processingTime = Date.now() - startTime;
    
    console.log(`Text extraction completed for ${fileName} in ${processingTime}ms`);

    return NextResponse.json({
      success: true,
      text: extractedText.trim(),
      processingTime
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Error in text extraction:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process image. Please try again.',
        processingTime
      },
      { status: 500 }
    );
  }
}