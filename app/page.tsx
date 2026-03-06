'use client'
import GoogleLogin from '@/components/GoogleLogin'
import ImageUploader from '@/components/ImageUploader'
import PredictionResult from '@/components/PredictionResult'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

export default function Home() {
    const { data: session, status } = useSession()
    const [uploadedImage, setUploadedImage] = useState<File | null>(null)
    const [prediction, setPrediction] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleUploadAndPredict = async (imageFile: File) => {
        setUploadedImage(imageFile) // keep the file
        setLoading(true)
        setError(null)
        setPrediction(null)

        try {
            const formData = new FormData()
            formData.append('image', imageFile)
            //formData.append('user_id', session?.user?.email || 'anonymous')

            const response = await fetch('/api/predict', {
                method: 'POST',
                body: formData,
            })

            if (response.status === 401) {
                throw new Error('Please sign in to continue')
            }

            if (!response.ok) {
                throw new Error('Failed to get prediction')
            }
	@@ -51,34 +46,80 @@ export default function Home() {
        }
    }

    const handleNewPrediction = () => {
        setPrediction(null)
        setError(null)
    }

    if (status === 'loading') {
        return <div className="loading">Loading...</div>
    }

    return (
        <main className="container">
            <div className="header">
                <h1>🐾 Animal Predic</h1>
                <p>Identify animals from images using AI</p>
                {session && (
                    <button
                        onClick={() => signOut()}
                        className="logout-button"
                    >
                        Logout
                    </button>
                )}
            </div>

            {!session ? (
                <GoogleLogin
                    onSuccess={() => { }}
                    onError={(err) => console.error(err)}
                />
            ) : (
                <div className="content">
                    <div className="user-info">
                        <p>Welcome, {session.user?.name}!</p>
                    </div>

                    {/* Always render uploaded image if it exists */}
                    {prediction && uploadedImage && (
                        <div className="uploaded-image-wrapper">
                            <img
                                src={URL.createObjectURL(uploadedImage)}
                                alt="Uploaded"
                                className="uploaded-image"
                            />
                        </div>
                    )}

                    {/* Before prediction: show uploader */}
                    {!prediction && (
                        <>
                            <ImageUploader
                                onUpload={handleUploadAndPredict}
                                isLoading={loading}
                            />

                            {error && <div className="error-message">{error}</div>}

                            {loading && (
                                <div className="loading">Processing your image...</div>
                            )}
                        </>
                    )}

                    {/* After prediction: show result */}
                    {prediction && (
                        <div className="prediction-result-section">
                            <PredictionResult prediction={prediction} />
                            <button
                                onClick={handleNewPrediction}
                                className="new-prediction-button"
                            >
                                Analyze Another Image
                            </button>
                        </div>
                    )}
                </div>
            )}
        </main>