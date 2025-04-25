import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/modules/auth/supabaseClient';
import * as Sentry from '@sentry/browser';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { isInAppBrowser } from '@/modules/core/utils/browserDetection';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inAppBrowserDetected, setInAppBrowserDetected] = useState(isInAppBrowser());

  // If user is already logged in, redirect to home
  if (user) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-text">
          Create your Aviary account
        </h2>
        <p className="mt-2 text-center text-sm text-text-light">
          Or{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-background-secondary py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-4 text-center">
            <p className="text-sm text-text-light">Sign up with ZAPT</p>
            <a 
              href="https://www.zapt.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:text-primary-dark"
            >
              Learn more about ZAPT
            </a>
          </div>
          
          {inAppBrowserDetected && (
            <div className="mb-4 p-3 bg-warning bg-opacity-10 text-warning rounded-md text-sm">
              You're using an in-app browser which may cause issues with Google Sign In. 
              For the best experience, please open this page in your device's default browser.
            </div>
          )}

          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={inAppBrowserDetected ? [] : ['google', 'facebook', 'apple']}
            magicLink={true}
            theme="light"
            view="sign_up"
            showLinks={false}
            redirectTo={`${window.location.origin}/`}
          />
        </div>
      </div>
    </div>
  );
}