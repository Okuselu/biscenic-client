"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

interface SubmissionMessage {
  success: boolean
  message: string
}

export default function Contact() {
  const [submissionMessage, setSubmissionMessage] = useState<SubmissionMessage | null>(null)
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSending(true)
    setSubmissionMessage(null)

    const formData = new FormData(event.currentTarget)
    const firstName = (formData.get("firstName") as string)?.trim()
    const lastName = (formData.get("lastName") as string)?.trim()
    const email = (formData.get("email") as string)?.trim()
    const phone = (formData.get("phone") as string)?.trim()
    const subject = (formData.get("subject") as string)?.trim()
    const message = (formData.get("message") as string)?.trim()

    // Basic validation
    if (!firstName || !lastName || !email || !subject || !message) {
      setSubmissionMessage({ success: false, message: "Please fill in all required fields." })
      setIsSending(false)
      return
    }

    const emailBody = `
First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
Phone: ${phone || "N/A"}

Message:
${message}
`.trim()

    // Construct mailto link
    const mailtoLink = `mailto:biscenic@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(emailBody)}`

    try {
      window.location.href = mailtoLink
      setSubmissionMessage({ success: true, message: "Opening your email client..." })
      event.currentTarget.reset()
    } catch (error) {
      console.error("Failed to open email client:", error)
      setSubmissionMessage({
        success: false,
        message: "Failed to open email client. Please check your device settings.",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-wider">CONTACT US</h1>
          <p className="text-gray-600 text-lg">We're here to assist you with any inquiries</p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-light mb-8 tracking-wide">GET IN TOUCH</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      FIRST NAME *
                    </label>
                    <Input id="firstName" name="firstName" className="border-gray-300 focus:border-black" required />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      LAST NAME *
                    </label>
                    <Input id="lastName" name="lastName" className="border-gray-300 focus:border-black" required />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    EMAIL *
                  </label>
                  <Input id="email" name="email" type="email" className="border-gray-300 focus:border-black" required />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    PHONE
                  </label>
                  <Input id="phone" name="phone" type="tel" className="border-gray-300 focus:border-black" />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    SUBJECT *
                  </label>
                  <Input id="subject" name="subject" className="border-gray-300 focus:border-black" required />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    MESSAGE *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="border-gray-300 focus:border-black resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSending}
                  className="bg-[#7e8f6c] text-white hover:bg-white hover:text-black px-8 py-3 w-full"
                >
                  {isSending ? "OPENING EMAIL..." : "SEND MESSAGE"}
                </Button>

                {submissionMessage && (
                  <p
                    className={`text-center text-sm ${
                      submissionMessage.success ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {submissionMessage.message}
                  </p>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-light mb-8 tracking-wide">CONTACT INFORMATION</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 mt-1 text-gray-600" />
                  <div>
                    <h3 className="font-medium mb-2">JORDAN BROOKES, LAGOS, NIGERIA</h3>
                    <p className="text-gray-600">
                      4 Dada Fayemi Close
                      <br />
                      Osapa, London.
                    </p>
                    <br />
                    <h3 className="font-medium mb-2">PENNY LANE, GEORGIA</h3>
                    <p className="text-gray-600">
                      Penny Lane South-east City
                      <br />
                      State, Georgia.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 mt-1 text-gray-600" />
                  <div>
                    <h3 className="font-medium mb-2">PHONE</h3>
                    <p className="text-gray-600">+2348061789132</p>
                    <p className="text-gray-600">+14706219649</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 mt-1 text-gray-600" />
                  <div>
                    <h3 className="font-medium mb-2">EMAIL</h3>
                    <p className="text-gray-600">biscenic@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 mt-1 text-gray-600" />
                  <div>
                    <h3 className="font-medium mb-2">HOURS</h3>
                    <p className="text-gray-600">
                      Monday - Saturday: 07:00 AM - 08:00 PM
                      <br />
                      Sunday: 11:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="font-medium mb-4">CLIENT SERVICES</h3>
                <p className="text-gray-600 mb-4">
                  For immediate assistance with orders, returns, or product inquiries, please contact our client services team.
                </p>
                <Button
                  variant="outline"
                  className="border-black bg-[#7e8f6c] text-white hover:bg-white hover:text-black"
                  asChild
                >
                  <a href="mailto:biscenic@gmail.com">CONTACT CLIENT SERVICES</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}





// "use client"

// import type React from "react"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { MapPin, Phone, Mail, Clock } from "lucide-react"
// import { useState } from "react" // Import useState

// export default function Contact() {
//   const [submissionMessage, setSubmissionMessage] = useState<{ success: boolean; message: string } | null>(null)
//   const [isSending, setIsSending] = useState(false)

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault() // Prevent default form submission
//     setIsSending(true)
//     setSubmissionMessage(null)

//     const formData = new FormData(event.currentTarget)
//     const firstName = formData.get("firstName") as string
//     const lastName = formData.get("lastName") as string
//     const email = formData.get("email") as string
//     const phone = formData.get("phone") as string
//     const subject = formData.get("subject") as string
//     const message = formData.get("message") as string

//     // Basic client-side validation
//     if (!firstName || !lastName || !email || !subject || !message) {
//       setSubmissionMessage({ success: false, message: "Please fill in all required fields." })
//       setIsSending(false)
//       return
//     }

//     const emailBody = `
//     First Name: ${firstName}
//     Last Name: ${lastName}
//     Email: ${email}
//     Phone: ${phone || "N/A"}
//     Message:
//     ${message}
//   `.trim()

//     // Construct the mailto link
//     const mailtoLink = `mailto:biscenic@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`

//     try {
//       window.location.href = mailtoLink // Open the email client
//       setSubmissionMessage({ success: true, message: "Opening your email client..." })
//       // Optionally, clear the form after successful opening
//       event.currentTarget.reset()
//     } catch (error) {
//       console.error("Failed to open email client:", error)
//       setSubmissionMessage({ success: false, message: "Failed to open email client. Please check your settings." })
//     } finally {
//       setIsSending(false)
//     }
//   }

//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="bg-gray-50 py-20">
//         <div className="max-w-4xl mx-auto px-4 text-center">
//           <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-wider">CONTACT US</h1>
//           <p className="text-gray-600 text-lg">We're here to assist you with any inquiries</p>
//         </div>
//       </section>

//       {/* Contact Form & Info */}
//       <section className="py-20">
//         <div className="max-w-6xl mx-auto px-4">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
//             {/* Contact Form */}
//             <div>
//               <h2 className="text-2xl font-light mb-8 tracking-wide">GET IN TOUCH</h2>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label htmlFor="firstName" className="block text-sm font-medium mb-2">
//                       FIRST NAME
//                     </label>
//                     <Input id="firstName" name="firstName" className="border-gray-300 focus:border-black" required />
//                   </div>
//                   <div>
//                     <label htmlFor="lastName" className="block text-sm font-medium mb-2">
//                       LAST NAME
//                     </label>
//                     <Input id="lastName" name="lastName" className="border-gray-300 focus:border-black" required />
//                   </div>
//                 </div>
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium mb-2">
//                     EMAIL
//                   </label>
//                   <Input id="email" name="email" type="email" className="border-gray-300 focus:border-black" required />
//                 </div>
//                 <div>
//                   <label htmlFor="phone" className="block text-sm font-medium mb-2">
//                     PHONE
//                   </label>
//                   <Input id="phone" name="phone" type="tel" className="border-gray-300 focus:border-black" />
//                 </div>
//                 <div>
//                   <label htmlFor="subject" className="block text-sm font-medium mb-2">
//                     SUBJECT
//                   </label>
//                   <Input id="subject" name="subject" className="border-gray-300 focus:border-black" required />
//                 </div>
//                 <div>
//                   <label htmlFor="message" className="block text-sm font-medium mb-2">
//                     MESSAGE
//                   </label>
//                   <Textarea
//                     id="message"
//                     name="message"
//                     rows={6}
//                     className="border-gray-300 focus:border-black resize-none"
//                     required
//                   />
//                 </div>
//                 <Button
//                   type="submit"
//                   disabled={isSending}
//                   className="bg-[#7e8f6c] text-white hover:bg-white hover:text-black px-8 py-3 w-full"
//                 >
//                   {isSending ? "OPENING EMAIL..." : "SEND MESSAGE"}
//                 </Button>
//                 {submissionMessage && (
//                   <p className={`text-center text-sm ${submissionMessage.success ? "text-green-600" : "text-red-600"}`}>
//                     {submissionMessage.message}
//                   </p>
//                 )}
//               </form>
//             </div>

//             {/* Contact Information */}
//             <div>
//               <h2 className="text-2xl font-light mb-8 tracking-wide">CONTACT INFORMATION</h2>
//               <div className="space-y-8">
//                 <div className="flex items-start space-x-4">
//                   <MapPin className="w-6 h-6 mt-1 text-gray-600" />
//                   <div>
//                     <h3 className="font-medium mb-2">JORDAN BROOKES, LAGOS, NIGERIA. </h3>
//                     <p className="text-gray-600">
//                       4 Dada Fayemi Close
//                       <br />
//                       Osapa, London.
//                     </p>
//                     <br />
//                     <h3 className="font-medium mb-2">PENNY LANE, GEORGIA. </h3>
//                     <p className="text-gray-600">
//                       Penny Lane South-east City
//                       <br />
//                       State, Georgia.
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-4">
//                   <Phone className="w-6 h-6 mt-1 text-gray-600" />
//                   <div>
//                     <h3 className="font-medium mb-2">PHONE</h3>
//                     <p className="text-gray-600">+2348061789132</p>
//                     <p className="text-gray-600">+14706219649</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-4">
//                   <Mail className="w-6 h-6 mt-1 text-gray-600" />
//                   <div>
//                     <h3 className="font-medium mb-2">EMAIL</h3>
//                     <p className="text-gray-600">biscenic@gmail.com</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-4">
//                   <Clock className="w-6 h-6 mt-1 text-gray-600" />
//                   <div>
//                     <h3 className="font-medium mb-2">HOURS</h3>
//                     <p className="text-gray-600">
//                       Monday - Saturday: 07:00 AM - 08:00 PM
//                       <br />
//                       Sunday: 11:00 AM - 6:00 PM
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-12">
//                 <h3 className="font-medium mb-4">CLIENT SERVICES</h3>
//                 <p className="text-gray-600 mb-4">
//                   For immediate assistance with orders, returns, or product inquiries, please contact our client
//                   services team.
//                 </p>
//                 <Button
//                   variant="outline"
//                   className="border-black bg-[#7e8f6c] text-white hover:bg-white hover:text-black"
//                   asChild
//                 >
//                   <a href="mailto:biscenic@gmail.com">CONTACT CLIENT SERVICES</a>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }
