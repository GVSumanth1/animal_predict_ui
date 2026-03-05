'use client'

interface PredictionResultProps {
    prediction: any
}

export default function PredictionResult({ prediction }: PredictionResultProps) {
    return (
        <div className="result-container">
            <div className="result-card">
                <h2>🎯 Prediction Result</h2>

                {prediction.animal && (
                    <div className="result-item">
                        <strong>Animal:</strong> {prediction.animal}
                    </div>
                )}

                {prediction.confidence && (
                    <div className="result-item">
                        <strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(2)}%
                        <div className="confidence-bar">
                            <div
                                className="confidence-fill"
                                style={{ width: `${prediction.confidence * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {prediction.details && (
                    <div className="result-item">
                        <strong>Details:</strong> {prediction.details}
                    </div>
                )}

                {prediction.species && (
                    <div className="result-item">
                        <strong>Species:</strong> {prediction.species}
                    </div>
                )}

                {prediction.description && (
                    <div className="result-item">
                        <strong>Description:</strong> {prediction.description}
                    </div>
                )}

                {/* Display any additional data */}
                {typeof prediction === 'object' && (
                    <div className="result-raw">
                        <details>
                            <summary>Full Response</summary>
                            <pre>{JSON.stringify(prediction, null, 2)}</pre>
                        </details>
                    </div>
                )}
            </div>
        </div>
    )
}