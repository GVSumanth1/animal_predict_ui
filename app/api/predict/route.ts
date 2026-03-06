import axios from 'axios'
import FormData from 'form-data'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/auth-options'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        console.log('--- Incoming predict request ---')

        const incomingForm = await request.formData()
        const imageFile = incomingForm.get('image') as File | null

        if (!imageFile) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 })
        }

        // Convert File -> Buffer
        const arrayBuffer = await imageFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Build multipart form
        const outgoingForm = new FormData()
        outgoingForm.append('file', buffer, {
            filename: imageFile.name || 'image.jpg',
            contentType: imageFile.type || 'image/jpeg',
            knownLength: buffer.length,
        })

        // Forward Google user info
        outgoingForm.append('user_email', session.user.email!)
        outgoingForm.append('user_name', session.user.name || '')

        let predictionServiceUrl =
            process.env.PREDICTION_SERVICE_URL || 'http://localhost:8080'

        if (!/^https?:\/\//i.test(predictionServiceUrl)) {
            predictionServiceUrl = `http://${predictionServiceUrl}`
        }

        predictionServiceUrl = predictionServiceUrl.replace(/\/+$/, '')

        const response = await axios.post(
            `${predictionServiceUrl}/predict`,
            outgoingForm,
            {
                headers: {
                    ...outgoingForm.getHeaders(),
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            }
        )

        console.log('✅ Prediction response received')

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('❌ Prediction error')
        return NextResponse.json(
            { error: 'Failed to process image' },
            { status: 500 }