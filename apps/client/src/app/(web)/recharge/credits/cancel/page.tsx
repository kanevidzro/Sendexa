// app/credits/cancel/page.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CreditPurchaseCancel() {
  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <XCircle className="h-16 w-16 text-yellow-500 mx-auto" />
          <h2 className="text-2xl font-bold text-yellow-600">Payment Cancelled</h2>
          <p className="text-lg">
            Your payment was cancelled. No charges have been made to your account.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/credits/buy">Try Again</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/home">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}