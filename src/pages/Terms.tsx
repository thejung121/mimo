
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Terms = () => {
  const [activeTab, setActiveTab] = useState("terms");
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Termos Legais</h1>
          
          <Tabs defaultValue="terms" onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="terms">Termos de Uso</TabsTrigger>
              <TabsTrigger value="privacy">Política de Privacidade</TabsTrigger>
            </TabsList>
            
            <TabsContent value="terms">
              <Card>
                <CardContent className="pt-6 text-gray-700">
                  <h2 className="text-2xl font-semibold mb-4">Termos de Uso</h2>
                  <p className="mb-4">
                    Última atualização: {new Date().toLocaleDateString('pt-BR')}
                  </p>
                  
                  <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2">1. Aceitação dos Termos</h3>
                    <p className="mb-3">
                      Ao acessar ou usar a plataforma Mimo, você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, por favor, não utilize nossos serviços.
                    </p>
                  </section>
                  
                  <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2">2. Descrição do Serviço</h3>
                    <p className="mb-3">
                      A Mimo é uma plataforma que conecta criadores de conteúdo e seus fãs, permitindo que os fãs apoiem financeiramente os criadores através da compra de pacotes de recompensas ("mimos").
                    </p>
                  </section>
                  
                  <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2">3. Conta de Usuário</h3>
                    <p className="mb-3">
                      Para utilizar alguns dos recursos da nossa plataforma, você precisará criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorrerem em sua conta.
                    </p>
                  </section>
                  
                  <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2">4. Conteúdo do Usuário</h3>
                    <p className="mb-3">
                      Ao enviar, postar ou exibir conteúdo na Mimo, você nos concede uma licença mundial, não exclusiva, livre de royalties para usar, reproduzir, adaptar, publicar, traduzir e distribuir seu conteúdo em qualquer mídia.
                    </p>
                    <p className="mb-3">
                      Você é o único responsável pelo conteúdo que publica e pelas consequências de compartilhá-lo. A Mimo não endossa nenhum conteúdo enviado pelos usuários nem garante sua precisão ou qualidade.
                    </p>
                  </section>
                  
                  <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2">5. Regras de Conduta</h3>
                    <p className="mb-3">Você concorda em não:</p>
                    <ul className="list-disc pl-6 mb-3 space-y-1">
                      <li>Publicar conteúdo que seja ilegal, abusivo, difamatório, pornográfico ou que viole direitos de terceiros</li>
                      <li>Utilizar a plataforma para qualquer finalidade ilegal ou não autorizada</li>
                      <li>Interferir ou interromper o funcionamento da plataforma</li>
                      <li>Tentar acessar áreas restritas da plataforma</li>
                      <li>Criar múltiplas contas com o objetivo de violar estes termos</li>
                    </ul>
                  </section>
                  
                  <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2">6. Pagamentos e Reembolsos</h3>
                    <p className="mb-3">
                      Todos os pagamentos são processados através de nossa plataforma de pagamento parceira. Ao fazer uma compra, você concorda com os termos e políticas do processador de pagamento.
                    </p>
                    <p className="mb-3">
                      Devido à natureza digital do conteúdo oferecido, não oferecemos reembolsos após a conclusão da compra, a menos que exigido por lei.
                    </p>
                  </section>
                  
                  <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2">7. Modificações dos Termos</h3>
                    <p className="mb-3">
                      Reservamo-nos o direito de modificar estes termos a qualquer momento, a nosso critério. As alterações entrarão em vigor imediatamente após a publicação dos termos atualizados.
                    </p>
                  </section>
                  
                  <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2">8. Limitação de Responsabilidade</h3>
                    <p className="mb-3">
                      A Mimo não será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos decorrentes do uso ou incapacidade de usar a plataforma.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-xl font-medium mb-2">9. Lei Aplicável</h3>
                    <p>
                      Estes termos serão regidos e interpretados de acordo com as leis do Brasil, sem consideração a conflitos de princípios legais.
                    </p>
                  </section>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy">
              <Card>
                <CardContent className="pt-6 text-gray-700">
                  <h2 className="text-2xl font-semibold mb-4">Política de Privacidade</h2>
                  <p className="mb-4">
                    Última atualização: {new Date().toLocaleDateString('pt-BR')}
                  </p>
                  
                  <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2">1. Coleta de Informações</h3>
                    <p className="mb-3">
                      Coletamos informações que você nos fornece diretamente quando se registra em nossa plataforma, cria ou modifica sua conta, compra produtos ou serviços, solicita atendimento ao cliente ou se comunica conosco de qualquer forma.
                    </p>
                    <p className="mb-3">
                      Essas informações podem incluir: nome, endereço de email, número de telefone, informações de pagamento, fotos de perfil e qualquer outro conteúdo que você opte por fornecer.
                    </p>
                  </section>
                  
                  <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2">2. Uso das Informações</h3>
                    <p className="mb-3">Utilizamos as informações coletadas para:</p>
                    <ul className="list-disc pl-6 mb-3 space-y-1">
                      <li>Fornecer, manter e melhorar nossos serviços</li>
                      <li>Processar transações e enviar notificações relacionadas</li>
                      <li>Responder a seus comentários, perguntas e solicitações</li>
                      <li>Enviar informações técnicas, atualizações e mensagens administrativas</li>
                      <li>Comunicar novidades, eventos e outras informações sobre nossos serviços</li>
                      <li>Monitorar e analisar tendências, uso e atividades</li>
                      <li>Detectar, investigar e prevenir atividades fraudulentas e não autorizadas</li>
                    </ul>
                  </section>
                  
                  <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2">3. Compartilhamento de Informações</h3>
                    <p className="mb-3">
                      Podemos compartilhar suas informações pessoais com:
                    </p>
                    <ul className="list-disc pl-6 mb-3 space-y-1">
                      <li>Prestadores de serviços que realizam serviços em nosso nome</li>
                      <li>Parceiros comerciais com os quais oferecemos produtos ou serviços conjuntos</li>
                      <li>Quando necessário para cumprir a lei, intimações ou outros processos legais</li>
                      <li>Para proteger os direitos, propriedade ou segurança da Mimo, nossos usuários ou o público</li>
                    </ul>
                  </section>
                  
                  <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2">4. Segurança</h3>
                    <p className="mb-3">
                      Implementamos medidas de segurança razoáveis para proteger as informações pessoais que coletamos e mantemos. No entanto, nenhum sistema é completamente seguro, e não podemos garantir a segurança absoluta de suas informações.
                    </p>
                  </section>
                  
                  <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2">5. Seus Direitos</h3>
                    <p className="mb-3">
                      Você tem o direito de acessar, corrigir ou excluir suas informações pessoais, bem como o direito de restringir ou se opor a certos tipos de processamento. Você também pode solicitar a portabilidade de seus dados.
                    </p>
                  </section>
                  
                  <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2">6. Cookies e Tecnologias Semelhantes</h3>
                    <p className="mb-3">
                      Utilizamos cookies e tecnologias semelhantes para coletar informações sobre como você interage com nossos serviços e nos permitir lembrar de você. Podemos usar essas tecnologias para personalizar sua experiência, coletar estatísticas e personalizar o conteúdo e os anúncios.
                    </p>
                  </section>
                  
                  <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2">7. Alterações nesta Política</h3>
                    <p className="mb-3">
                      Podemos alterar esta Política de Privacidade de tempos em tempos. Se fizermos alterações, notificaremos você revisando a data no topo da política e, em alguns casos, podemos fornecer aviso adicional.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-xl font-medium mb-2">8. Contato</h3>
                    <p>
                      Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo email: privacidade@mimo.app
                    </p>
                  </section>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
