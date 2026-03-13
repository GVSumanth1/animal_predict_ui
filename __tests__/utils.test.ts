/**
 * Utility function tests
 */

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
        return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are supported.' }
    }

    if (file.size > maxSize) {
        return { valid: false, error: 'File size must be less than 5MB.' }
    }

    return { valid: true }
}

describe('validateImageFile', () => {
    it('should validate correct image file', () => {
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
        const result = validateImageFile(file)
        expect(result.valid).toBe(true)
        expect(result.error).toBeUndefined()
    })

    it('should reject invalid file type', () => {
        const file = new File(['test'], 'test.txt', { type: 'text/plain' })
        const result = validateImageFile(file)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('Invalid file type')
    })

    it('should reject oversized files', () => {
        const largeBuffer = new Uint8Array(6 * 1024 * 1024) // 6MB
        const file = new File([largeBuffer], 'large.jpg', { type: 'image/jpeg' })
        const result = validateImageFile(file)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('File size')
    })

    it('should accept valid PNG file', () => {
        const file = new File(['test'], 'test.png', { type: 'image/png' })
        const result = validateImageFile(file)
        expect(result.valid).toBe(true)
    })

    it('should accept valid WebP file', () => {
        const file = new File(['test'], 'test.webp', { type: 'image/webp' })
        const result = validateImageFile(file)
        expect(result.valid).toBe(true)
    })
})