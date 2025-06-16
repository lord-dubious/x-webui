"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Upload, X, Image, Video } from 'lucide-react'
import { UseAi } from '@/lib/aiContext'

interface MediaUploadProps {
  onMediaChange: (files: File[]) => void
  maxFiles?: number
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onMediaChange, maxFiles = 4 }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<Map<string, string>>(new Map())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { currentProvider } = UseAi()

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [previewUrls])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      
      return (isImage || isVideo) && isValidSize
    })

    if (validFiles.length + uploadedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    const newFiles = [...uploadedFiles, ...validFiles]
    setUploadedFiles(newFiles)
    onMediaChange(newFiles)
  }

  const removeFile = (index: number) => {
    const fileToRemove = uploadedFiles[index]
    if (!fileToRemove) return

    // Revoke object URL for the removed file
    const fileKey = `${fileToRemove.name}-${fileToRemove.size}`
    const url = previewUrls.get(fileKey)
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url)
      const newPreviewUrls = new Map(previewUrls)
      newPreviewUrls.delete(fileKey)
      setPreviewUrls(newPreviewUrls)
    }

    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onMediaChange(newFiles)
  }

  const clearAll = () => {
    setUploadedFiles([])
    onMediaChange([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image size={16} />
    } else if (file.type.startsWith('video/')) {
      return <Video size={16} />
    }
    return null
  }

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      const fileKey = `${file.name}-${file.size}`

      // Check if we already have a URL for this file
      if (previewUrls.has(fileKey)) {
        return previewUrls.get(fileKey)!
      }

      // Create new object URL and store it
      const url = URL.createObjectURL(file)
      const newPreviewUrls = new Map(previewUrls)
      newPreviewUrls.set(fileKey, url)
      setPreviewUrls(newPreviewUrls)

      return url
    }
    return null
  }

  // Only show for Gemini provider
  if (currentProvider !== 'gemini') {
    return null
  }

  return (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4">
      <div className="text-center">
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
          Upload Images or Videos
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Gemini can analyze your media to enhance tweet content
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadedFiles.length >= maxFiles}
        >
          <Upload size={16} className="mr-2" />
          Choose Files
        </Button>
        
        <p className="text-xs text-gray-400 mt-2">
          Max {maxFiles} files, 10MB each. Supports images and videos.
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Uploaded Files ({uploadedFiles.length}/{maxFiles})
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={clearAll}
              className="text-red-600 hover:text-red-700"
            >
              Clear All
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="relative bg-gray-50 dark:bg-gray-700 rounded-lg p-2 border"
              >
                {getFilePreview(file) && (
                  <img
                    src={getFilePreview(file)!}
                    alt={file.name}
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 min-w-0">
                    {getFileIcon(file)}
                    <span className="text-xs truncate" title={file.name}>
                      {file.name}
                    </span>
                  </div>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="p-1 h-6 w-6 text-red-600 hover:text-red-700"
                  >
                    <X size={12} />
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500 mt-1">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MediaUpload
