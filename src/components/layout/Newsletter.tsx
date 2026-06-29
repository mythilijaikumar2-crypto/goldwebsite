import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2 } from 'lucide-react';

const newsletterSchema = zod.object({
  email: zod.string().email('Please enter a valid email address')
});

type NewsletterForm = zod.infer<typeof newsletterSchema>;

export const Newsletter: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema)
  });

  const onSubmit = (data: NewsletterForm) => {
    console.log('[ASCOPE JEWELLLERY] Newsletter signup email:', data.email);
    setSubscribed(true);
  };

  return (
    <section className="py-16 bg-[#0E0E0E] border-y border-gold-primary/5 select-none relative overflow-hidden">
      {/* Golden halo backdrop light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-gold-primary/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
        <h3 className="font-heading text-2xl md:text-3xl text-gold-light tracking-wide mb-2">
          Join the JKS Atelier
        </h3>
        <p className="font-luxury italic text-sm text-neutral-400 max-w-lg mx-auto mb-8">
          Subscribe to receive exclusive invitations to collection previews, private sales events, and gold rate insights.
        </p>

        <AnimatePresence mode="wait">
          {!subscribed ? (
            <motion.form
              key="newsletter-form"
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col sm:flex-row gap-3 items-stretch max-w-md mx-auto"
            >
              <div className="grow relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  {...register('email')}
                  className="w-full bg-luxury-surface border border-gold-primary/20 focus:border-gold-primary text-xs py-3.5 pl-10 pr-4 rounded text-white outline-none transition font-body"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
                {errors.email && (
                  <span className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-body">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="bg-gold-primary text-black font-body text-xs font-semibold uppercase tracking-widest px-6 py-3.5 rounded hover:bg-gold-light hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_4px_12px_rgba(212,175,55,0.15)] cursor-pointer"
              >
                Subscribe
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success-message"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center gap-2.5 p-4 border border-gold-primary/20 bg-gold-primary/5 rounded max-w-sm mx-auto"
            >
              <CheckCircle2 className="w-8 h-8 text-gold-primary animate-bounce" />
              <div className="font-heading text-sm text-gold-light font-semibold uppercase tracking-wider">
                Invitation Registered
              </div>
              <p className="text-xs text-neutral-400 font-body leading-relaxed text-center">
                We have sent an welcome note to your email. Welcome to our luxury circle.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
export default Newsletter;
