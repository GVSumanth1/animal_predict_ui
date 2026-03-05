import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const imageFile = formData.get('image') as File
        const userId = formData.get('user_id') as string

        if (!imageFile) {
            return NextResponse.json(
                { error: 'No image provided' },
                { status: 400 }
            )
        }

        // Convert file to buffer
        const buffer = Buffer.from(await imageFile.arrayBuffer())

        // Get prediction service URL from environment
        const predictionServiceUrl =
            process.env.PREDICTION_SERVICE_URL || 'http://localhost:5000'

        // Send to prediction service
        const formDataToSend = new FormData()
        formDataToSend.append('image', imageFile)
        formDataToSend.append('user_id', userId)

        const predictionResponse = await axios.post(
            `${predictionServiceUrl}/predict`,
            formDataToSend,
            {
                headers: {
                    ...formDataToSend.getHeaders?.(),
                },
            }
        )

        return NextResponse.json(predictionResponse.data)
    } catch (error) {
        console.error('Prediction error:', error)
        return NextResponse.json(
            { error: 'Failed to process image' },
            { status: 500 }
        )
    }
}