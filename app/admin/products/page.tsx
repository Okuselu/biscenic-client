"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, PlusCircle, Upload, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// API Hooks
import { 
  useProducts, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct 
} from "@/services/products/queries"
import { useCategories } from "@/services/categories/queries"
import { formatPrice, getMainImage } from "@/lib/utils/product"
import type { Product } from "@/services/products/types"

// Form data interface
interface ProductFormData {
  name: string
  description: string
  price: string
  stock: string
  category: string
  images: File[]
  existingImages?: Product['images']
  imagesToKeep?: string[]
}


export default function AdminProductsPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // API hooks
  const { data: products = [], isLoading, error } = useProducts()
  const { data: categories = [] } = useCategories()
  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()
  const deleteProductMutation = useDeleteProduct()


  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
    existingImages: [],
    imagesToKeep: []
  })

  // Image preview state
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])


  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      images: [],
      existingImages: [],
      imagesToKeep: []
    })
    setImagePreviewUrls([])
    setEditingProduct(null)
  }

  const handleAddProduct = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category._id,
      images: [],
      existingImages: product.images,
      imagesToKeep: product.images.map(img => img.publicId)
    })
    setImagePreviewUrls([])
    setIsModalOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return
    
    try {
      await deleteProductMutation.mutateAsync(productToDelete._id)
      setIsDeleteModalOpen(false)
      setProductToDelete(null)
    } catch (error) {
      console.error("Delete failed:", error)
    }
  }

  const cancelDelete = () => {
    setIsDeleteModalOpen(false)
    setProductToDelete(null)
  }

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const invalidFiles = files.filter(file => !validTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid File Type",
        description: "Please upload only JPEG, PNG, or WebP images.",
        variant: "destructive",
      })
      return
    }

    // Validate file sizes (max 5MB each)
    const maxSize = 5 * 1024 * 1024 // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      toast({
        title: "File Too Large",
        description: "Each image must be smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file))
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls])
  }

  const removeNewImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index])
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (publicId: string) => {
    setFormData(prev => ({
      ...prev,
      imagesToKeep: prev.imagesToKeep?.filter(id => id !== publicId)
    }))
  }

  const handleSubmit = async () => {
    
    // Validation
    const price = parseFloat(formData.price)
    const stock = parseInt(formData.stock)
    
    if (!formData.name.trim() || !formData.description.trim() || isNaN(price) || isNaN(stock) || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
        variant: "destructive",
      })
      return
    }

    if (price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive",
      })
      return
    }

    if (stock < 0) {
      toast({
        title: "Invalid Stock",
        description: "Please enter a valid stock quantity.",
        variant: "destructive",
      })
      return
    }

    // Check if we have at least one image (new or existing)
    const totalImages = formData.images.length + (formData.imagesToKeep?.length || 0)
    
    if (totalImages === 0) {
      toast({
        title: "No Images",
        description: "Please add at least one product image using the 'Upload Images' button.",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingProduct) {
        // Update existing product
        await updateProductMutation.mutateAsync({
          id: editingProduct._id,
          productData: {
            name: formData.name.trim(),
            description: formData.description.trim(),
            price,
            stock,
            category: formData.category,
            existingImageIds: formData.imagesToKeep?.join(',') || '',
            images: formData.images
          }
        })
      } else {
        // Create new product
        await createProductMutation.mutateAsync({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price,
          stock,
          category: formData.category,
          images: formData.images
        })
      }

    setIsModalOpen(false)
      resetForm()
    } catch (error) {
      console.error("Submit failed:", error)
    }
  }

  const getStockColor = (stock: number) => {
    if (stock === 0) return "bg-red-100 text-red-800"
    if (stock < 5) return "bg-orange-100 text-orange-800"
    if (stock < 15) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat._id === categoryId)?.name || 'Unknown'
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg">Loading products...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Products</CardTitle>
            <CardDescription>
              Failed to load products. Please check your connection and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 px-4 py-12 relative">
      <Card className="w-full max-w-7xl shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold tracking-wide">Product Management</CardTitle>
            <CardDescription>
              Manage your store's product catalog. {products.length} products total.
            </CardDescription>
          </div>
          <Button 
            className="bg-black text-white hover:bg-gray-800 flex items-center gap-2" 
            onClick={handleAddProduct}
            disabled={createProductMutation.isPending}
          >
            {createProductMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
            Add Product
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <Image
                        src={getMainImage(product.images)}
                        alt={product.name}
                        width={60}
                        height={80}
                        className="rounded-md object-cover border"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getStockColor(product.stock)}>
                        {product.stock} {product.stock === 1 ? 'item' : 'items'}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditProduct(product)}
                        className="hover:bg-blue-100"
                        disabled={updateProductMutation.isPending}
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product)}
                        className="hover:bg-red-100"
                        disabled={deleteProductMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {products.length === 0 && (
            <div className="text-center py-12">
              <PlusCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No products found</p>
              <p className="text-gray-400 text-sm mb-4">Add your first product to get started!</p>
              <Button onClick={handleAddProduct} className="bg-black text-white hover:bg-gray-800">
                Add Your First Product
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Product Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" style={{ zIndex: 9998 }} />
          <DialogContent 
            className="fixed left-[50%] top-[50%] grid w-full max-w-[600px] max-h-[90vh] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-2xl duration-200 overflow-y-auto rounded-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]" 
            style={{ zIndex: 9999 }}>
            <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
              <DialogDescription>
              {editingProduct 
                ? "Make changes to this product. All fields are optional except images." 
                : "Fill in the product details. All fields are required."
              }
              </DialogDescription>
            </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter product description"
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    className="mt-1"
                />
              </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent 
                    className="z-[99999] bg-white border shadow-lg max-h-60" 
                    position="popper" 
                    sideOffset={5}>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        Loading categories... ({categories.length} available)
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-4">
              <div>
                <Label>Product Images *</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Upload high-quality images. First image will be the main image.
                </p>
              </div>

              {/* Existing Images (for edit mode) */}
              {formData.existingImages && formData.existingImages.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Current Images</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {formData.existingImages.map((image) => (
                      <div key={image.publicId} className="relative">
                        <Image
                          src={image.url}
                          alt="Product image"
                          width={150}
                          height={150}
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => removeExistingImage(image.publicId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {image.isMain && (
                          <Badge className="absolute bottom-2 left-2 text-xs">
                            Main
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {imagePreviewUrls.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">New Images</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={url}
                          alt={`New image ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => removeNewImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {index === 0 && !formData.existingImages?.some(img => img.isMain) && (
                          <Badge className="absolute bottom-2 left-2 text-xs">
                            Main
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPEG, PNG, WebP. Max size: 5MB per image.
                </p>
              </div>
            </div>
          </div>

            <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={createProductMutation.isPending || updateProductMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={createProductMutation.isPending || updateProductMutation.isPending}
              className="bg-black text-white hover:bg-gray-800"
            >
              {createProductMutation.isPending || updateProductMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingProduct ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {editingProduct ? "Update Product" : "Create Product"}
                </>
              )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
        </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" style={{ zIndex: 9998 }} />
          <DialogContent 
            className="fixed left-[50%] top-[50%] grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-2xl duration-200 rounded-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]" 
            style={{ zIndex: 9999 }}
          >
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Product</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the product from your catalog.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              {productToDelete && (
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Image
                    src={getMainImage(productToDelete.images)}
                    alt={productToDelete.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover border"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{productToDelete.name}</p>
                    <p className="text-sm text-gray-500">{formatPrice(productToDelete.price)}</p>
                    <p className="text-xs text-gray-400">Stock: {productToDelete.stock} items</p>
                  </div>
                </div>
              )}
              
              <p className="mt-4 text-sm text-gray-600">
                Are you sure you want to delete <strong>"{productToDelete?.name}"</strong>? 
                This will remove it from your store and cannot be undone.
              </p>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={cancelDelete}
                disabled={deleteProductMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteProductMutation.isPending}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {deleteProductMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Product"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  )
}