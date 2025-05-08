
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would send the form data to your backend
    toast({
      title: "Mensagem enviada!",
      description: "Agradecemos seu contato. Responderemos em breve.",
    });
    
    // Reset form
    const form = e.target as HTMLFormElement;
    form.reset();
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Entre em Contato</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex p-3 rounded-full bg-primary-100">
                  <Phone className="h-6 w-6 text-primary-700" />
                </div>
                <h3 className="text-lg font-medium mb-2">WhatsApp</h3>
                <p className="text-gray-600 mb-3">Atendimento por WhatsApp</p>
                <a 
                  href="https://wa.me/5511999999999" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  +55 (11) 99999-9999
                </a>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex p-3 rounded-full bg-primary-100">
                  <Mail className="h-6 w-6 text-primary-700" />
                </div>
                <h3 className="text-lg font-medium mb-2">Email</h3>
                <p className="text-gray-600 mb-3">Suporte por email</p>
                <a 
                  href="mailto:suporte@mimo.app" 
                  className="text-primary-600 hover:underline"
                >
                  suporte@mimo.app
                </a>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex p-3 rounded-full bg-primary-100">
                  <Mail className="h-6 w-6 text-primary-700" />
                </div>
                <h3 className="text-lg font-medium mb-2">Email Comercial</h3>
                <p className="text-gray-600 mb-3">Para parcerias e negócios</p>
                <a 
                  href="mailto:comercial@mimo.app" 
                  className="text-primary-600 hover:underline"
                >
                  comercial@mimo.app
                </a>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Envie uma mensagem</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Nome</label>
                    <Input id="name" name="name" required placeholder="Seu nome completo" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <Input id="email" name="email" type="email" required placeholder="seu@email.com" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">Assunto</label>
                  <Input id="subject" name="subject" required placeholder="Assunto da mensagem" />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Mensagem</label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    required 
                    placeholder="Escreva sua mensagem aqui..." 
                    rows={6}
                  />
                </div>
                
                <div className="pt-2">
                  <Button type="submit" className="w-full md:w-auto">
                    Enviar Mensagem
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <p className="text-gray-600">
              Horário de atendimento: Segunda a Sexta, das 9h às 18h
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
