// app/(protected)/stocks/page.tsx
"use client"

import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link"
import { allStocks } from "@/lib/data/stocks"




export default function StocksPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter stocks based on search term
  const filteredStocks = useMemo(() => {
    if (!searchTerm) {
      return allStocks;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allStocks.filter(stock =>
      stock.symbol.toLowerCase().includes(lowerCaseSearchTerm) ||
      stock.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [searchTerm]);

  // Separate featured stocks
  const featuredStocks = useMemo(() =>
    filteredStocks.filter(stock => stock.isFeatured),
    [filteredStocks]
  );
  // Get non-featured stocks for the main list
  const nonFeaturedStocks = useMemo(() =>
    filteredStocks.filter(stock => !stock.isFeatured),
    [filteredStocks]
  );

  return (
    <div className="container max-w-6xl py-12 space-y-10">

      {/* 1. Page Header (Slightly smaller font size) */}
      <div className="space-y-1">
        <h4 className="text-xl font-extrabold tracking-tight"> {/* text-4xl reduced to text-3xl */}
          Market Overview
        </h4>
        <p className="text-sm text-muted-foreground"> {/* text reduced slightly */}
          Discover and trade over 300+ real U.S. stocks instantly.
        </p>
      </div>

      <Separator />

      {/* 2. Search Bar and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search stocks by symbol or name (e.g., AAPL, Apple)"
            className="pl-10 h-12 w-full text-sm" // text size reduced
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="default" className="h-12 w-full md:w-auto text-sm font-semibold">
          Apply Filters
        </Button>
      </div>

      {/* 3. FEATURED STOCKS SECTION: LOGO PROMINENCE INCREASED */}
      {featuredStocks.length > 0 && searchTerm === '' && (
        <>
          <h2 className="text-md font-bold tracking-tight flex items-center gap-2">
            Featured Stocks
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredStocks.map((stock) => {
              const isPositive = stock.change >= 0;
              const changeColor = isPositive ? "text-emerald-500" : "text-red-500";
              const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

              return (
                <Card
                  key={stock.symbol}
                  className="p-5 flex flex-col items-center justify-between hover:border-primary transition-all duration-200 shadow-xl"
                >

                  {/* LOGO: MASSIVE & CENTERED */}
                  <div className="flex flex-col items-center mb-4 w-full">
                    {stock.imageUrl && (
                      <Image
                        src={stock.imageUrl}
                        alt={`${stock.symbol} logo`}
                        width={128} // Increased Size
                        height={128} // Increased Size
                        className="rounded-2xl bg-gray-50 p-4 shadow-lg object-contain mb-4" // Prominent Styling
                        priority
                      />
                    )}

                    {/* TEXT: Symbol & Name (Centered under logo) */}
                    <h3 className="text-xl font-bold tracking-tight text-center">{stock.symbol}</h3>
                    <p className="text-xs text-muted-foreground text-center mt-0.5">{stock.name}</p>
                  </div>

                  {/* PRICE & CHANGE (Bottom Section, remains separated for clarity) */}
                  <div className="text-center w-full pt-4 border-t border-border/50">
                    <p className="text-2xl font-extrabold">${parseInt(stock.price.toFixed(2)).toLocaleString()}</p>
                    <div className={`flex items-center justify-center mt-1 ${changeColor}`}>
                      <ChangeIcon className="h-4 w-4 mr-1" />
                      <p className={`text-base font-semibold`}>
                        {isPositive ? "+" : ""}{stock.change.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/purchase?symbol=${stock.symbol}`}
                  >
                    <Button
                      className="w-full text-sm font-semibold mt-4 transition-transform duration-100 hover:scale-[1.01]"
                      variant={isPositive ? "default" : "destructive"}
                    >
                      Purchase {stock.symbol}
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
          <Separator />
        </>
      )}

      {/* 4. ALL STOCKS SECTION: LOGO PROMINENCE INCREASED MINIMALLY */}
      <h2 className="text-xl font-bold tracking-tight">
        {searchTerm ? `Search Results for "${searchTerm}"` : "All Stocks"}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {nonFeaturedStocks.length > 0 ? (
          nonFeaturedStocks.map((stock) => {
            const isPositive = stock.change >= 0;
            const changeColor = isPositive ? "text-emerald-500" : "text-red-500";
            const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

            return (
              <Card
                key={stock.symbol}
                className="p-4 flex flex-col justify-between hover:border-primary transition-all duration-200 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  {/* Logo is now larger than standard list, but smaller than featured */}
                  <div className="flex items-center gap-4">
                    {stock.imageUrl && (
                      <Image
                        src={stock.imageUrl}
                        alt={`${stock.symbol} logo`}
                        width={68} // Increased from 32 to 48
                        height={68}
                        className="rounded-lg bg-gray-50 p-1 object-contain"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-bold tracking-tight">{stock.symbol}</h3> {/* Text reduced */}
                      <p className="text-xs text-muted-foreground mt-0.5">{stock.name}</p> {/* Text reduced */}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-extrabold">${parseInt(stock.price.toFixed(2)).toLocaleString()}</p> {/* Text reduced */}
                    <div className={`flex items-center justify-end mt-1 ${changeColor}`}>
                      <ChangeIcon className="h-3 w-3 mr-1" /> {/* Icon reduced */}
                      <p className={`text-sm font-semibold`}> {/* Text reduced */}
                        {isPositive ? "+" : ""}{stock.change.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                    href={`/dashboard/purchase?symbol=${stock.symbol}`}
                    >
                  <Button
                    className="w-full text-sm font-semibold transition-transform duration-100 hover:scale-[1.01]"
                    variant={isPositive ? "default" : "destructive"}
                  >
                    Purchase {stock.symbol}
                  </Button>
                </Link>
              </Card>
            );
          })
        ) : (
          <p className="col-span-full text-center text-muted-foreground py-8 border rounded-lg">
            No stocks found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}