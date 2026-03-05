'use client'

import GoogleLogin from '@/components/GoogleLogin'
import ImageUploader from '@/components/ImageUploader'
import PredictionResult from '@/components/PredictionResult'
import { useState } from 'react'

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userInfo, setUserInfo] = useState<any>(null)
    const [prediction, setPrediction] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLoginSuccess = (response: any) => {
        setIsLoggedIn(true)
        setUserInfo(response)
        setError(null)
    }

    const handleLoginError = (error: any) => {
        setError('Failed to login with Google')
        console.error('Login error:', error)
    }

    const handleUploadAndPredict = async (imageFile: File) => {
        setLoading(true)
        setError(null)
        setPrediction(null)

        try {
            const formData = new FormData()
            formData.append('image', imageFile)
            formData.append('user_id', userInfo?.id || 'anonymous')

            const response = await fetch('/api/predict', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to get prediction')
            }

            const data = await response.json()
            setPrediction(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="container">
            <div className="header">
                <h1>🐾 Animal Predic</h1>
                <p>Identify animals from images using AI</p>
            </div>

            {!isLoggedIn ? (
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginError}
                />
            ) : (
                <div className="content">
                    <div className="user-info">
                        <p>Welcome, {userInfo?.name}!</p>
                    </div>

                    <ImageUploader
                        onUpload={handleUploadAndPredict}
                        isLoading={loading}
                    />

                    {error && <div className="error-message">{error}</div>}

                    {loading && <div className="loading">Processing your image...</div>}

                    {prediction && <PredictionResult prediction={prediction} />}
                </div>
            )}
        </main>
    )
}