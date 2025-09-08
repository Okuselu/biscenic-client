"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, Trash2 } from "lucide-react"
import Image from "next/image"

// -----------------------------
// Static Carousel Images Setup
// -----------------------------
type CarouselKey = "carousel1" | "carousel2" | "carousel3"

const initialCarouselImages: Record<CarouselKey, string[]> = {
  carousel1: [
    "/images/living-room-bonsai.png",
    "/images/IMG_8437.jpg",
    "/placeholder.svg?height=700&width=1200",
    "/placeholder.svg?height=700&width=1200",
  ],
  carousel2: [
    "/images/exhibition-bonsai-chair.png",
    "/images/exhibition-bonsai-chair.png",
    "/placeholder.svg?height=700&width=1200",
    "/placeholder.svg?height=700&width=1200",
  ],
  carousel3: [
    "/placeholder.svg?height=700&width=1200",
    "/placeholder.svg?height=700&width=1200",
    "/placeholder.svg?height=700&width=1200",
    "/placeholder.svg?height=700&width=1200",
  ],
}

// -----------------------------
// Type-safe upload state objects
// -----------------------------
type SelectedFilesState = Record<CarouselKey, (File | null)[]>
type UploadingStates = Record<CarouselKey, boolean[]>
type UploadMessages = Record<
  CarouselKey,
  { [index: number]: { type: "success" | "error"; text: string; url?: string } | null }
>

export default function AdminExhibitionUploadsPage() {
  const [carouselImages, setCarouselImages] = useState(initialCarouselImages)
  const [selectedFiles, setSelectedFiles] = useState<SelectedFilesState>({
    carousel1: Array(initialCarouselImages.carousel1.length).fill(null),
    carousel2: Array(initialCarouselImages.carousel2.length).fill(null),
    carousel3: Array(initialCarouselImages.carousel3.length).fill(null),
  })
  const [uploadingStates, setUploadingStates] = useState<UploadingStates>({
    carousel1: Array(initialCarouselImages.carousel1.length).fill(false),
    carousel2: Array(initialCarouselImages.carousel2.length).fill(false),
    carousel3: Array(initialCarouselImages.carousel3.length).fill(false),
  })
  const [uploadMessages, setUploadMessages] = useState<UploadMessages>({
    carousel1: {},
    carousel2: {},
    carousel3: {},
  })

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, carouselKey: CarouselKey, imageIndex: number) => {
    const file = event.target.files ? event.target.files[0] : null
    setSelectedFiles((prev) => ({
      ...prev,
      [carouselKey]: prev[carouselKey].map((f, i) => (i === imageIndex ? file : f)),
    }))
    setUploadMessages((prev) => ({
      ...prev,
      [carouselKey]: { ...prev[carouselKey], [imageIndex]: null },
    }))
  }

  const handleUpload = async (carouselKey: CarouselKey, imageIndex: number) => {
    const file = selectedFiles[carouselKey][imageIndex]
    if (!file) {
      setUploadMessages((prev) => ({
        ...prev,
        [carouselKey]: {
          ...prev[carouselKey],
          [imageIndex]: { type: "error", text: "Please select a file to upload." },
        },
      }))
      return
    }

    setUploadingStates((prev) => ({
      ...prev,
      [carouselKey]: prev[carouselKey].map((s, i) => (i === imageIndex ? true : s)),
    }))
    setUploadMessages((prev) => ({
      ...prev,
      [carouselKey]: { ...prev[carouselKey], [imageIndex]: null },
    }))

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await response.json()

      if (response.ok) {
        setUploadMessages((prev) => ({
          ...prev,
          [carouselKey]: {
            ...prev[carouselKey],
            [imageIndex]: { type: "success", text: `File "${data.fileName}" uploaded! Copy URL:`, url: data.url },
          },
        }))
        setCarouselImages((prev) => ({
          ...prev,
          [carouselKey]: prev[carouselKey].map((url, i) => (i === imageIndex ? data.url : url)),
        }))
        setSelectedFiles((prev) => ({
          ...prev,
          [carouselKey]: prev[carouselKey].map((f, i) => (i === imageIndex ? null : f)),
        }))
      } else {
        setUploadMessages((prev) => ({
          ...prev,
          [carouselKey]: {
            ...prev[carouselKey],
            [imageIndex]: { type: "error", text: data.message || "Upload failed." },
          },
        }))
      }
    } catch (error) {
      console.error("Upload error:", error)
      setUploadMessages((prev) => ({
        ...prev,
        [carouselKey]: {
          ...prev[carouselKey],
          [imageIndex]: { type: "error", text: "An unexpected error occurred during upload." },
        },
      }))
    } finally {
      setUploadingStates((prev) => ({
        ...prev,
        [carouselKey]: prev[carouselKey].map((s, i) => (i === imageIndex ? false : s)),
      }))
    }
  }

  const handleDeleteImage = (carouselKey: CarouselKey, imageIndex: number) => {
    if (!confirm("Are you sure you want to remove this image slot?")) return

    setCarouselImages((prev) => ({
      ...prev,
      [carouselKey]: prev[carouselKey].map((url, i) =>
        i === imageIndex ? "/placeholder.svg?height=700&width=1200" : url
      ),
    }))
    setSelectedFiles((prev) => ({
      ...prev,
      [carouselKey]: prev[carouselKey].map((f, i) => (i === imageIndex ? null : f)),
    }))
    setUploadMessages((prev) => ({
      ...prev,
      [carouselKey]: { ...prev[carouselKey], [imageIndex]: null },
    }))
    setUploadingStates((prev) => ({
      ...prev,
      [carouselKey]: prev[carouselKey].map((s, i) => (i === imageIndex ? false : s)),
    }))
  }

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 px-4 py-12">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-wide">Exhibition Image Management</CardTitle>
          <CardDescription>
            Upload new images and update the carousel sliders on the Exhibition page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {Object.entries(carouselImages).map(([key, images], carouselIndex) => {
            const carouselKey = key as CarouselKey
            return (
              <div key={carouselKey} className="space-y-4 border p-6 rounded-lg bg-white">
                <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <ImageIcon className="h-6 w-6 text-gray-700" /> Carousel {carouselIndex + 1} Images
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  These images are static. Upload new ones and manually update `app/exhibition/page.tsx`.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {images.map((imgSrc, imgIndex) => (
                    <div key={imgIndex} className="flex flex-col gap-3 p-4 border rounded-lg bg-gray-50 relative">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-md border">
                        <Image src={imgSrc} alt={`Carousel ${carouselIndex + 1} Image ${imgIndex + 1}`} fill className="object-contain" />
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteImage(carouselKey, imgIndex)}
                        className="absolute top-2 right-2 hover:bg-red-100"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                        <span className="sr-only">Remove Image Slot</span>
                      </Button>

                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor={`file-${carouselKey}-${imgIndex}`}>Replace Image {imgIndex + 1}</Label>
                        <Input
                          id={`file-${carouselKey}-${imgIndex}`}
                          type="file"
                          onChange={(e) => handleFileChange(e, carouselKey, imgIndex)}
                          accept="image/*"
                        />
                      </div>

                      {selectedFiles[carouselKey][imgIndex] && (
                        <p className="text-xs text-gray-600">Selected: {selectedFiles[carouselKey][imgIndex]?.name}</p>
                      )}

                      <Button
                        onClick={() => handleUpload(carouselKey, imgIndex)}
                        disabled={uploadingStates[carouselKey][imgIndex] || !selectedFiles[carouselKey][imgIndex]}
                        className="bg-black text-white hover:bg-gray-800 flex items-center gap-2 text-sm"
                      >
                        {uploadingStates[carouselKey][imgIndex] ? "Uploading..." : "Upload for this slot"}
                      </Button>

                      {uploadMessages[carouselKey][imgIndex] && (
                        <div
                          className={`mt-2 text-xs ${
                            uploadMessages[carouselKey][imgIndex]?.type === "success" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          <p>{uploadMessages[carouselKey][imgIndex]?.text}</p>
                          {uploadMessages[carouselKey][imgIndex]?.url && (
                            <div className="mt-1 p-1 bg-gray-100 rounded break-all">
                              <code className="font-mono text-black">{uploadMessages[carouselKey][imgIndex]?.url}</code>
                              <p className="text-gray-500 mt-1">
                                Copy this URL and paste it into `app/exhibition/page.tsx` for this slot.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}




// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { ImageIcon, Trash2 } from "lucide-react"
// import Image from "next/image"

// // Initial hardcoded images from app/exhibition/page.tsx for display purposes
// const initialCarouselImages = {
//   carousel1: [
//     "/images/living-room-bonsai.png",
//     "/images/IMG_8437.jpg",
//     "/placeholder.svg?height=700&width=1200",
//     "/placeholder.svg?height=700&width=1200",
//   ],
//   carousel2: [
//     "/images/exhibition-bonsai-chair.png",
//     "/images/exhibition-bonsai-chair.png",
//     "/placeholder.svg?height=700&width=1200",
//     "/placeholder.svg?height=700&width=1200",
//   ],
//   carousel3: [
//     "/placeholder.svg?height=700&width=1200",
//     "/placeholder.svg?height=700&width=1200",
//     "/placeholder.svg?height=700&width=1200",
//     "/placeholder.svg?height=700&width=1200",
//   ],
// }

// export default function AdminExhibitionUploadsPage() {
//   const [carouselImages, setCarouselImages] = useState(initialCarouselImages)
//   const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: (File | null)[] }>({
//     carousel1: Array(initialCarouselImages.carousel1.length).fill(null),
//     carousel2: Array(initialCarouselImages.carousel2.length).fill(null),
//     carousel3: Array(initialCarouselImages.carousel3.length).fill(null),
//   })
//   const [uploadingStates, setUploadingStates] = useState<{ [key: string]: boolean[] }>({
//     carousel1: Array(initialCarouselImages.carousel1.length).fill(false),
//     carousel2: Array(initialCarouselImages.carousel2.length).fill(false),
//     carousel3: Array(initialCarouselImages.carousel3.length).fill(false),
//   })
//   const [uploadMessages, setUploadMessages] = useState<{
//     [key: string]: { [key: number]: { type: "success" | "error"; text: string; url?: string } | null }
//   }>({
//     carousel1: {},
//     carousel2: {},
//     carousel3: {},
//   })

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, carouselKey: string, imageIndex: number) => {
//     const file = event.target.files ? event.target.files[0] : null
//     setSelectedFiles((prev) => ({
//       ...prev,
//       [carouselKey]: prev[carouselKey].map((f, i) => (i === imageIndex ? file : f)),
//     }))
//     setUploadMessages((prev) => ({
//       ...prev,
//       [carouselKey]: { ...prev[carouselKey], [imageIndex]: null },
//     }))
//   }

//   const handleUpload = async (carouselKey: string, imageIndex: number) => {
//     const file = selectedFiles[carouselKey][imageIndex]

//     if (!file) {
//       setUploadMessages((prev) => ({
//         ...prev,
//         [carouselKey]: {
//           ...prev[carouselKey],
//           [imageIndex]: { type: "error", text: "Please select a file to upload." },
//         },
//       }))
//       return
//     }

//     setUploadingStates((prev) => ({
//       ...prev,
//       [carouselKey]: prev[carouselKey].map((s, i) => (i === imageIndex ? true : s)),
//     }))
//     setUploadMessages((prev) => ({
//       ...prev,
//       [carouselKey]: { ...prev[carouselKey], [imageIndex]: null },
//     }))

//     const formData = new FormData()
//     formData.append("file", file)

//     try {
//       const response = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       })

//       const data = await response.json()

//       if (response.ok) {
//         setUploadMessages((prev) => ({
//           ...prev,
//           [carouselKey]: {
//             ...prev[carouselKey],
//             [imageIndex]: {
//               type: "success",
//               text: `File "${data.fileName}" uploaded! Copy URL:`,
//               url: data.url,
//             },
//           },
//         }))
//         setCarouselImages((prev) => ({
//           ...prev,
//           [carouselKey]: prev[carouselKey].map((url, i) => (i === imageIndex ? data.url : url)),
//         }))
//         setSelectedFiles((prev) => ({
//           ...prev,
//           [carouselKey]: prev[carouselKey].map((f, i) => (i === imageIndex ? null : f)),
//         }))
//       } else {
//         setUploadMessages((prev) => ({
//           ...prev,
//           [carouselKey]: {
//             ...prev[carouselKey],
//             [imageIndex]: { type: "error", text: data.message || "Upload failed." },
//           },
//         }))
//       }
//     } catch (error) {
//       console.error("Upload error:", error)
//       setUploadMessages((prev) => ({
//         ...prev,
//         [carouselKey]: {
//           ...prev[carouselKey],
//           [imageIndex]: { type: "error", text: "An unexpected error occurred during upload." },
//         },
//       }))
//     } finally {
//       setUploadingStates((prev) => ({
//         ...prev,
//         [carouselKey]: prev[carouselKey].map((s, i) => (i === imageIndex ? false : s)),
//       }))
//     }
//   }

//   const handleDeleteImage = (carouselKey: string, imageIndex: number) => {
//     if (confirm("Are you sure you want to remove this image slot?")) {
//       setCarouselImages((prev) => ({
//         ...prev,
//         [carouselKey]: prev[carouselKey].map((url, i) =>
//           i === imageIndex ? "/placeholder.svg?height=700&width=1200" : url,
//         ),
//       }))
//       setSelectedFiles((prev) => ({
//         ...prev,
//         [carouselKey]: prev[carouselKey].map((f, i) => (i === imageIndex ? null : f)),
//       }))
//       setUploadMessages((prev) => {
//         const newMessages = { ...prev[carouselKey] }
//         newMessages[imageIndex] = null // Clear message for this slot
//         return {
//           ...prev,
//           [carouselKey]: newMessages,
//         }
//       })
//       setUploadingStates((prev) => ({
//         ...prev,
//         [carouselKey]: prev[carouselKey].map((s, i) => (i === imageIndex ? false : s)),
//       }))
//     }
//   }

//   return (
//     <div className="flex min-h-screen flex-col items-center bg-gray-100 px-4 py-12">
//       <Card className="w-full max-w-4xl shadow-lg">
//         <CardHeader className="space-y-1 text-center">
//           <CardTitle className="text-3xl font-bold tracking-wide">Exhibition Image Management</CardTitle>
//           <CardDescription>Upload new images and update the carousel sliders on the Exhibition page.</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-8">
//           {/* Current Carousel Images Display */}
//           <div className="space-y-6">
//             {Object.entries(carouselImages).map(([carouselKey, images], index) => (
//               <div key={carouselKey} className="space-y-4 border p-6 rounded-lg bg-white">
//                 <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
//                   <ImageIcon className="h-6 w-6 text-gray-700" /> Carousel {index + 1} Images
//                 </h3>
//                 <p className="text-sm text-gray-600 mb-6">
//                   These are the images currently hardcoded in `app/exhibition/page.tsx` for this carousel. Use the
//                   upload fields below to generate new URLs and then manually update the `app/exhibition/page.tsx` file.
//                 </p>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   {images.map((imageSrc, imgIndex) => (
//                     <div key={imgIndex} className="flex flex-col gap-3 p-4 border rounded-lg bg-gray-50 relative">
//                       <div className="relative aspect-[4/3] overflow-hidden rounded-md border">
//                         <Image
//                           src={imageSrc || "/placeholder.svg"}
//                           alt={`Carousel ${index + 1} Image ${imgIndex + 1}`}
//                           fill
//                           className="object-contain" // Changed from object-cover
//                         />
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleDeleteImage(carouselKey, imgIndex)}
//                         className="absolute top-2 right-2 hover:bg-red-100" // Position top-right
//                       >
//                         <Trash2 className="h-5 w-5 text-red-500" />
//                         <span className="sr-only">Remove Image Slot</span>
//                       </Button>
//                       <div className="grid w-full items-center gap-1.5">
//                         <Label htmlFor={`file-${carouselKey}-${imgIndex}`}>Replace Image {imgIndex + 1}</Label>
//                         <Input
//                           id={`file-${carouselKey}-${imgIndex}`}
//                           type="file"
//                           onChange={(e) => handleFileChange(e, carouselKey, imgIndex)}
//                           accept="image/*"
//                         />
//                       </div>
//                       {selectedFiles[carouselKey][imgIndex] && (
//                         <p className="text-xs text-gray-600">Selected: {selectedFiles[carouselKey][imgIndex]?.name}</p>
//                       )}
//                       <Button
//                         onClick={() => handleUpload(carouselKey, imgIndex)}
//                         disabled={uploadingStates[carouselKey][imgIndex] || !selectedFiles[carouselKey][imgIndex]}
//                         className="bg-black text-white hover:bg-gray-800 flex items-center gap-2 text-sm"
//                       >
//                         {uploadingStates[carouselKey][imgIndex] ? "Uploading..." : "Upload for this slot"}
//                       </Button>
//                       {uploadMessages[carouselKey][imgIndex] && (
//                         <div
//                           className={`mt-2 text-xs ${uploadMessages[carouselKey][imgIndex]?.type === "success" ? "text-green-600" : "text-red-600"}`}
//                         >
//                           <p>{uploadMessages[carouselKey][imgIndex]?.text}</p>
//                           {uploadMessages[carouselKey][imgIndex]?.url && (
//                             <div className="mt-1 p-1 bg-gray-100 rounded break-all">
//                               <code className="font-mono text-black">{uploadMessages[carouselKey][imgIndex]?.url}</code>
//                               <p className="text-gray-500 mt-1">
//                                 Copy this URL and paste it into `app/exhibition/page.tsx` for this slot.
//                               </p>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
