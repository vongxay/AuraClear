"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for contacting us. We'll get back to you soon.",
        duration: 5000,
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-24 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions, feedback, or need assistance? We&apos;re here to help. Reach out to our team using the form below or through our contact information.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
          
          <div>
            <div className="bg-card rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-pink-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-muted-foreground">
                      123 Clear Lane<br />
                      Cosmetic City, CA 90210<br />
                      United States
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-pink-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-muted-foreground">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-pink-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">
                      hello@auraclear.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-pink-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Business Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6">Follow Us</h2>
              
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <div className="bg-card rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">What is your return policy?</h3>
                <p className="text-muted-foreground">
                  We offer a 30-day return policy for all unused and unopened products. Please contact our customer service team to initiate a return.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Do you ship internationally?</h3>
                <p className="text-muted-foreground">
                  Yes, we ship to most countries worldwide. Shipping rates and delivery times vary by location.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Are your products cruelty-free?</h3>
                <p className="text-muted-foreground">
                  Absolutely! All our products are certified cruelty-free by Leaping Bunny. We never test on animals.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">How can I track my order?</h3>
                <p className="text-muted-foreground">
                  Once your order ships, you&apos;ll receive a confirmation email with tracking information. You can also track your order in your account dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}