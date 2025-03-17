import React from 'react';
import { Activity, Bell, Shield, Clock, Server, ArrowRight, Check } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center space-x-2 mb-8">
              <Activity className="h-8 w-8 text-purple-500" />
              <span className="text-2xl font-bold">UptimeGuard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Monitor Your Services with Confidence
            </h1>
            <p className="mt-6 text-xl text-gray-400">
              Get instant alerts when your services go down. Monitor uptime, performance, and ensure your business never misses a beat.
            </p>
            <div className="mt-8 flex items-center space-x-4">
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="px-6 py-3 text-gray-400 hover:text-white border border-gray-700 rounded-lg hover:border-gray-600 transition">
                View Demo
              </button>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
              alt="Dashboard"
              className="rounded-lg shadow-2xl ring-1 ring-gray-800"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-900 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">
            Everything you need for reliable monitoring
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Bell className="h-8 w-8 text-purple-500" />}
              title="Instant Alerts"
              description="Get notified immediately when your services experience downtime through multiple channels."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-purple-500" />}
              title="SSL Monitoring"
              description="Track SSL certificate expiration and get alerts before they expire."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-purple-500" />}
              title="Response Time"
              description="Monitor response times and get detailed performance metrics."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">
            Simple, transparent pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              title="Starter"
              price="29"
              features={[
                "10 monitors",
                "1-minute checks",
                "Email notifications",
                "5 team members",
              ]}
            />
            <PricingCard
              title="Professional"
              price="79"
              featured={true}
              features={[
                "50 monitors",
                "30-second checks",
                "All notification channels",
                "Unlimited team members",
                "API access",
              ]}
            />
            <PricingCard
              title="Enterprise"
              price="199"
              features={[
                "Unlimited monitors",
                "15-second checks",
                "Priority support",
                "Custom solutions",
                "SLA guarantees",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2">
                <Activity className="h-6 w-6 text-purple-500" />
                <span className="text-xl font-bold">UptimeGuard</span>
              </div>
              <p className="mt-4 text-gray-400">
                Keeping your services online, always.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 UptimeGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function PricingCard({ title, price, features, featured = false }) {
  return (
    <div className={`p-8 rounded-lg border ${
      featured 
        ? 'bg-purple-900 border-purple-500 ring-2 ring-purple-500' 
        : 'bg-gray-800 border-gray-700'
    }`}>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">${price}</span>
        <span className="text-sm text-gray-400">/month</span>
      </div>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-300">
            <Check className="h-5 w-5 mr-2 text-purple-500" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        className={`mt-8 w-full py-3 px-4 rounded-lg transition ${
          featured
            ? 'bg-purple-500 text-white hover:bg-purple-600'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        Get Started
      </button>
    </div>
  );
}

export default App;