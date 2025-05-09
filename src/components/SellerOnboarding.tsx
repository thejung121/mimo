import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Check, Heart, Instagram, Mail, Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

// Define validation schemas for each step
const personalInfoSchema = z.object({
  fullName: z.string().min(3, { message: "O nome completo é obrigatório" }),
  workName: z.string().min(2, { message: "O nome de trabalho é obrigatório" })
});

const contactInfoSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  whatsapp: z.string().min(11, { message: "WhatsApp inválido" }).max(15)
});

const socialInfoSchema = z.object({
  instagram: z.string().min(1, { message: "Instagram é obrigatório" }).startsWith('@', {
    message: "Instagram deve começar com @"
  })
});

const documentInfoSchema = z.object({
  document: z.string()
    .min(11, { message: "CPF/CNPJ deve ter pelo menos 11 dígitos" })
    .max(18, { message: "CPF/CNPJ não pode ter mais de 18 dígitos" })
    .refine((val) => /^\d{11}$|^\d{14}$/.test(val.replace(/[^\d]/g, '')), {
      message: "CPF deve ter 11 dígitos ou CNPJ 14 dígitos"
    })
});

// Type for combined form data
type SellerFormData = z.infer<typeof personalInfoSchema> & 
  z.infer<typeof contactInfoSchema> & 
  z.infer<typeof socialInfoSchema> & 
  z.infer<typeof documentInfoSchema>;

const SellerOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<SellerFormData>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize forms for each step
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: formData.fullName || "",
      workName: formData.workName || ""
    }
  });

  const contactInfoForm = useForm<z.infer<typeof contactInfoSchema>>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      email: formData.email || "",
      whatsapp: formData.whatsapp || ""
    }
  });

  const socialInfoForm = useForm<z.infer<typeof socialInfoSchema>>({
    resolver: zodResolver(socialInfoSchema),
    defaultValues: {
      instagram: formData.instagram || "@"
    }
  });

  const documentInfoForm = useForm<z.infer<typeof documentInfoSchema>>({
    resolver: zodResolver(documentInfoSchema),
    defaultValues: {
      document: formData.document || ""
    }
  });

  // Handle form submission for each step
  const onPersonalInfoSubmit = (data: z.infer<typeof personalInfoSchema>) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const onContactInfoSubmit = (data: z.infer<typeof contactInfoSchema>) => {
    setFormData({ ...formData, ...data });
    setStep(3);
  };

  const onSocialInfoSubmit = (data: z.infer<typeof socialInfoSchema>) => {
    setFormData({ ...formData, ...data });
    setStep(4);
  };

  const onDocumentInfoSubmit = (data: z.infer<typeof documentInfoSchema>) => {
    // Combine all form data
    const completeFormData = {
      ...formData,
      ...data
    };

    // In a real application, you would send this data to your backend
    console.log("Complete form data:", completeFormData);
    
    // Show success toast
    toast({
      title: "Cadastro realizado com sucesso!",
      description: "Bem-vindo(a) ao Mimo! Vamos configurar sua página agora.",
    });

    // Navigate to dashboard or setup page
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  // Function to format CPF/CNPJ as user types
  const formatDocument = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format based on length (CPF or CNPJ)
    if (digits.length <= 11) {
      // CPF format: 123.456.789-01
      return digits
        .replace(/(\d{3})(?=\d)/, '$1.')
        .replace(/(\d{3})(?=\d)/, '$1.')
        .replace(/(\d{3})(?=\d)/, '$1-');
    } else {
      // CNPJ format: 12.345.678/0001-90
      return digits
        .replace(/(\d{2})(?=\d)/, '$1.')
        .replace(/(\d{3})(?=\d)/, '$1.')
        .replace(/(\d{3})(?=\d)/, '$1/')
        .replace(/(\d{4})(?=\d)/, '$1-');
    }
  };

  // Progress indicator based on current step
  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center items-center mb-6">
        <div className="flex items-center">
          {[1, 2, 3, 4].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div 
                className={`rounded-full h-10 w-10 flex items-center justify-center border-2 
                  ${step >= stepNumber 
                    ? 'border-mimo-primary bg-mimo-primary/10 text-mimo-primary' 
                    : 'border-muted text-muted-foreground'
                  }`}
              >
                {step > stepNumber ? <Check className="h-5 w-5" /> : stepNumber}
              </div>
              {stepNumber < 4 && (
                <div 
                  className={`h-1 w-10 mx-1 
                    ${step > stepNumber ? 'bg-mimo-primary' : 'bg-muted'}
                  `}>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-center mb-2">
          <Heart className="h-8 w-8 text-mimo-primary" fill="#9b87f5" />
        </div>
        <CardTitle className="text-center">Crie sua página no Mimo</CardTitle>
        <CardDescription className="text-center">
          {step === 1 && "Vamos começar com suas informações pessoais"}
          {step === 2 && "Agora, informe seus dados de contato"}
          {step === 3 && "Conecte suas redes sociais"}
          {step === 4 && "Para finalizar, precisamos do seu documento"}
        </CardDescription>
        {renderStepIndicator()}
      </CardHeader>
      
      <CardContent>
        {step === 1 && (
          <Form {...personalInfoForm}>
            <form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)} className="space-y-4">
              <FormField
                control={personalInfoForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={personalInfoForm.control}
                name="workName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome artístico/profissional</FormLabel>
                    <FormControl>
                      <Input placeholder="Como os fãs te conhecem" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mimo-button group">
                Continuar <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </Form>
        )}
        
        {step === 2 && (
          <Form {...contactInfoForm}>
            <form onSubmit={contactInfoForm.handleSubmit(onContactInfoSubmit)} className="space-y-4">
              <FormField
                control={contactInfoForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="seu@email.com" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={contactInfoForm.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input 
                          placeholder="DDD + Número (apenas números)" 
                          className="pl-10" 
                          {...field} 
                          onChange={(e) => {
                            // Only allow numbers
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="w-1/3">
                  Voltar
                </Button>
                <Button 
                  type="submit" 
                  className="w-2/3 mimo-button group">
                  Continuar <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>
          </Form>
        )}
        
        {step === 3 && (
          <Form {...socialInfoForm}>
            <form onSubmit={socialInfoForm.handleSubmit(onSocialInfoSubmit)} className="space-y-4">
              <FormField
                control={socialInfoForm.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Instagram className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input 
                          placeholder="@seu_instagram" 
                          className="pl-10" 
                          {...field} 
                          onChange={(e) => {
                            let value = e.target.value;
                            if (!value.startsWith('@') && value) {
                              value = '@' + value;
                            }
                            field.onChange(value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(2)}
                  className="w-1/3">
                  Voltar
                </Button>
                <Button 
                  type="submit" 
                  className="w-2/3 mimo-button group">
                  Continuar <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>
          </Form>
        )}
        
        {step === 4 && (
          <Form {...documentInfoForm}>
            <form onSubmit={documentInfoForm.handleSubmit(onDocumentInfoSubmit)} className="space-y-4">
              <FormField
                control={documentInfoForm.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF ou CNPJ</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Seu CPF ou CNPJ" 
                        {...field} 
                        onChange={(e) => {
                          const formattedValue = formatDocument(e.target.value);
                          field.onChange(formattedValue);
                        }}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      O CPF/CNPJ será registrado como sua chave PIX para recebimentos.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(3)}
                  className="w-1/3">
                  Voltar
                </Button>
                <Button 
                  type="submit" 
                  className="w-2/3 mimo-button group">
                  Finalizar cadastro <Heart className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
      
      <CardFooter className="flex-col">
        <p className="text-xs text-center text-muted-foreground mt-2">
          Ao se cadastrar, você concorda com nossos <a href="#" className="text-mimo-primary hover:underline">Termos de Serviço</a> e <a href="#" className="text-mimo-primary hover:underline">Política de Privacidade</a>.
        </p>
      </CardFooter>
    </Card>
  );
};

export default SellerOnboarding;
