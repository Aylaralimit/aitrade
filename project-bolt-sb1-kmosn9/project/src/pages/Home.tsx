import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, LineChart, Shield, Target, BookOpen, TrendingUp, Users, Award, Video } from 'lucide-react';

const features = [
  {
    icon: <Bot className="h-8 w-8 text-white" />,
    title: "Yapay Zeka Trading",
    description: "Gelişmiş algoritmalar ile otomatik alım-satım stratejileri ve anlık piyasa analizi"
  },
  {
    icon: <LineChart className="h-8 w-8 text-white" />,
    title: "Gelişmiş Teknik Analiz",
    description: "100'den fazla indikatör, özel çizim araçları ve profesyonel grafik analizi"
  },
  {
    icon: <Shield className="h-8 w-8 text-white" />,
    title: "Akıllı Risk Yönetimi",
    description: "Otomatik stop-loss, dinamik pozisyon boyutlandırma ve portföy optimizasyonu"
  },
  {
    icon: <Target className="h-8 w-8 text-white" />,
    title: "Sinyal Sistemi",
    description: "Yapay zeka destekli alım-satım sinyalleri ve fırsat bildirimleri"
  },
  {
    icon: <BookOpen className="h-8 w-8 text-white" />,
    title: "Eğitim Merkezi",
    description: "Canlı webinarlar, video eğitimler ve profesyonel trader mentorluğu"
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-white" />,
    title: "Portföy Analizi",
    description: "Detaylı performans raporları, kar/zarar analizi ve optimizasyon önerileri"
  }
];

const vipFeatures = [
  {
    icon: <Target className="h-8 w-8 text-white" />,
    title: "VIP Sinyaller",
    description: "Yüksek başarı oranlı özel alım-satım sinyalleri ve erken fırsat bildirimleri"
  },
  {
    icon: <Users className="h-8 w-8 text-white" />,
    title: "Özel Danışmanlık",
    description: "Profesyonel trader'lardan birebir danışmanlık ve strateji desteği"
  },
  {
    icon: <LineChart className="h-8 w-8 text-white" />,
    title: "Gelişmiş Analiz",
    description: "Yapay zeka destekli piyasa analizi ve trend tahminleri"
  },
  {
    icon: <Shield className="h-8 w-8 text-white" />,
    title: "Risk Koruması",
    description: "Otomatik zarar kesme ve dinamik pozisyon yönetimi"
  },
  {
    icon: <Bot className="h-8 w-8 text-white" />,
    title: "Özel Trading Botları",
    description: "Kişiselleştirilmiş otomatik trading botları ve strateji optimizasyonu"
  },
  {
    icon: <Award className="h-8 w-8 text-white" />,
    title: "Premium Destek",
    description: "7/24 öncelikli teknik destek ve özel müşteri temsilcisi"
  }
];

const educationFeatures = [
  {
    icon: <Video className="h-8 w-8 text-white" />,
    title: "Canlı Webinarlar",
    description: "Haftalık canlı eğitim ve analiz oturumları, soru-cevap seansları"
  },
  {
    icon: <BookOpen className="h-8 w-8 text-white" />,
    title: "Video Kütüphanesi",
    description: "500+ saatlik eğitim videosu, teknik ve temel analiz dersleri"
  },
  {
    icon: <Target className="h-8 w-8 text-white" />,
    title: "Strateji Eğitimi",
    description: "Profesyonel trading stratejileri ve risk yönetimi teknikleri"
  },
  {
    icon: <Users className="h-8 w-8 text-white" />,
    title: "Mentor Programı",
    description: "Birebir mentorluk ve kişisel gelişim programı"
  }
];

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative min-h-[600px] bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950">
        <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 animate-float">
            Yapay Zeka ile Borsa Yatırımı
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12">
            Gelişmiş yapay zeka algoritmaları ve gerçek zamanlı piyasa analizi ile yatırımlarınızı yönetin.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/trading"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              Hemen Başla
              <TrendingUp className="ml-2 h-6 w-6" />
            </Link>
            <Link
              to="/markets"
              className="inline-flex items-center px-8 py-4 bg-white text-lg font-medium rounded-lg text-blue-600 hover:bg-blue-50"
            >
              Piyasaları İncele
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Premium Özellikler
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 bg-opacity-20 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-blue-100">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* VIP Features */}
      <div className="bg-gray-50 dark:bg-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            VIP Özellikleri
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {vipFeatures.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Eğitim ve Gelişim
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {educationFeatures.map((feature, index) => (
            <div key={index} className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 bg-opacity-20 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-purple-100">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-12 max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Yapay Zeka ile Trading'e Başlayın
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Hemen ücretsiz demo hesap oluşturun ve Premium Trade farkını yaşayın.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-blue-600 transition-colors"
          >
            Ücretsiz Hesap Oluştur
            <TrendingUp className="ml-2 h-6 w-6" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;