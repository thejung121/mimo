
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Sobre Nós</h1>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Nossa Missão</h2>
              <p className="text-gray-700 mb-6">
                A Mimo nasceu com uma missão clara: criar uma plataforma que valorize o trabalho dos criadores de conteúdo e fortaleça a conexão entre eles e seus fãs. Acreditamos que os criadores merecem ter controle sobre seu conteúdo e receber o devido reconhecimento por seu trabalho.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4">Nossa História</h2>
              <p className="text-gray-700 mb-6">
                Fundada em 2023, a Mimo surgiu da percepção de que muitos criadores de conteúdo enfrentavam dificuldades para monetizar seu trabalho e manter uma relação saudável com seus fãs. Nossos fundadores, que são apaixonados por tecnologia e cultura digital, decidiram criar uma solução que pudesse atender às necessidades dos criadores modernos.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Nossos Valores</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Transparência em todas as transações</li>
                    <li>Respeito à privacidade dos usuários</li>
                    <li>Valorização do trabalho dos criadores</li>
                    <li>Inovação contínua da plataforma</li>
                    <li>Construção de uma comunidade forte e saudável</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">O Que Nos Diferencia</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Taxas justas e transparentes</li>
                    <li>Interface intuitiva para criadores e fãs</li>
                    <li>Ferramentas personalizáveis de monetização</li>
                    <li>Suporte dedicado aos criadores</li>
                    <li>Foco na segurança e privacidade</li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4">Nossa Equipe</h2>
              <p className="text-gray-700 mb-6">
                Somos uma equipe diversa e apaixonada, composta por desenvolvedores, designers, especialistas em marketing e atendimento ao cliente. Todos compartilhamos a mesma visão de criar a melhor plataforma possível para criadores e fãs.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4">O Futuro</h2>
              <p className="text-gray-700">
                Estamos constantemente trabalhando para melhorar a Mimo e oferecer novas funcionalidades que ajudem os criadores a prosperar. Nossa visão é construir um ecossistema onde criadores possam se concentrar em fazer o que amam, enquanto nós cuidamos da tecnologia e da infraestrutura.
              </p>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <p className="text-gray-600 italic">
              "Acreditamos no poder dos criadores para transformar o mundo através do seu conteúdo."
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
