'use client'

interface PredictionResultProps {
    prediction: any
}

export default function PredictionResult({ prediction }: PredictionResultProps) {
    const mainConfidence = prediction.top?.[0]?.[1] || 0
    const animalMessage =
        typeof prediction?.animal === 'string' ? prediction.animal : ''
    const isValidationWarning =
        !prediction?.description &&
        animalMessage.toLowerCase().includes('valid animal image')

    return (
        <div className="result-container">
            <div className="result-card">
                <h2> Prediction Result</h2>

                {prediction.animal && !isValidationWarning && (
                    <div className="result-item">
                        <strong>Animal:</strong> {prediction.animal}
                    </div>
                )}

                {isValidationWarning && (
                    <div className="result-item result-warning">
                        <strong>Notice:</strong> {animalMessage}
                    </div>
                )}

                {mainConfidence > 0 && !isValidationWarning && (
                    <div className="result-item">
                        <strong>Confidence:</strong> {(mainConfidence * 100).toFixed(2)}%
                        <div className="confidence-bar">
                            <div
                                className="confidence-fill"
                                style={{ width: `${mainConfidence * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {prediction.description && (
                    <div className="result-item">
                        <strong>Description:</strong> {prediction.description}
                    </div>
                )}

                {prediction.top && prediction.top.length > 0 && !isValidationWarning && (
                    <div className="result-item">
                        <strong>Top Predictions:</strong>
                        <ul className="predictions-list">
                            {prediction.top.map(
                                (item: [string, number], index: number) => (
                                    <li key={index}>
                                        {item[0]}: {(item[1] * 100).toFixed(2)}%
                                    </li>
                                )
                            )}
                        </ul>
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