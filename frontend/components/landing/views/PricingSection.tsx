import { Button } from '../../common/Button';

function PricingTier({ title, price, features, onClick }: { title: string; price: string; features: string[]; onClick: () => void }) {
  return (
    <div className="bg-secondary-background p-6 rounded-lg shadow-lg flex flex-col h-full">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-3xl font-bold mb-6">{price}</p>
      <ul className="list-disc list-inside mb-6 flex-grow flex flex-col items-start">
        {features.map((feature, index) => (
          <li key={index} className="mb-2">{feature}</li>
        ))}
      </ul>
      <Button className="mt-auto py-2" onClick={onClick}>Get Started</Button>
    </div>
  );
}

interface PricingSectionProps {
  onFreeTierClick: () => void;
  onProTierClick: () => void;
}

export function PricingSection({ onFreeTierClick, onProTierClick }: PricingSectionProps) {
  return (
    <div className="w-full max-w-[1000px] mx-auto my-20">
      <h2 className="text-4xl font-bold mb-10">Pricing</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PricingTier
          title="Free"
          price="$0"
          features={[
            "Up to 5,000 words",
            "Unlimited users",
            "Unlimited translated languages",
            "500 AI credits"
          ]}
          onClick={onFreeTierClick}
        />
        <PricingTier
          title="Pro"
          price="$25/month"
          features={[
            "Up to 200,000 words",
            "Unlimited users",
            "Unlimited translated languages",
            "20,000 AI credits"
          ]}
          onClick={onProTierClick}
        />
      </div>
      <p className="mt-8 text-lg text-text-secondary">Larger plans available upon request</p>
    </div>
  );
}