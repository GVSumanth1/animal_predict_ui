'use client'
import { useRef, useState } from 'react'
interface ImageUploaderProps {
    onUpload: (file: File) => void
    isLoading: boolean
}
export default function ImageUploader({
    onUpload,
    isLoading,
}: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file')
                return
            }
            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
            // Upload
            onUpload(file)
        }
    }
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        const file = event.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
            onUpload(file)
        }
    }

    const handleSelectNewImage = () => {
        setPreview(null)
        fileInputRef.current?.click()
    }

    return (
        <div className="uploader-section">
            <div
                className="upload-area"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {preview && (
                    <div className="preview-container">
                        <img src={preview} alt="Preview" className="preview-image" />
                    </div>
                )}
                {!preview && (
                    <div className="upload-placeholder">
                        <p>📸 Drag and drop an image here</p>
                        <p>or click to select</p>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isLoading}
                    style={{ display: 'none' }}
                />
            </div>

            <button
                onClick={handleSelectNewImage}
                disabled={isLoading}
                className="upload-button"
            >
                {isLoading ? 'Processing...' : 'Select Image'}
            </button>
        </div>
    )
}