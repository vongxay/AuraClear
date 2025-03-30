"use client";

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ProductFilters = () => {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);

  const categories = [
    { id: 'skincare', label: 'Skincare' },
    { id: 'makeup', label: 'Makeup' },
    { id: 'haircare', label: 'Haircare' },
    { id: 'fragrance', label: 'Fragrance' },
    { id: 'bath-body', label: 'Bath & Body' },
  ];

  const brands = [
    { id: 'aura', label: 'Aura Clear' },
    { id: 'glow', label: 'Glow Essentials' },
    { id: 'natura', label: 'Natura' },
    { id: 'pure', label: 'Pure Elements' },
    { id: 'luxe', label: 'Luxe Cosmetics' },
  ];

  const ratings = [
    { id: '4-up', label: '4 Stars & Up' },
    { id: '3-up', label: '3 Stars & Up' },
    { id: '2-up', label: '2 Stars & Up' },
    { id: '1-up', label: '1 Star & Up' },
  ];

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  };

  const toggleRating = (ratingId: string) => {
    setSelectedRatings(prev => 
      prev.includes(ratingId)
        ? prev.filter(id => id !== ratingId)
        : [...prev, ratingId]
    );
  };

  const resetFilters = () => {
    setPriceRange([0, 100]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedRatings([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <Slider
          defaultValue={[0, 100]}
          max={100}
          step={1}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-2"
        />
        <div className="flex items-center justify-between">
          <span className="text-sm">${priceRange[0]}</span>
          <span className="text-sm">${priceRange[1]}</span>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "brands", "ratings"]} className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger className="font-medium">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category.id}`} 
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <Label 
                    htmlFor={`category-${category.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands">
          <AccordionTrigger className="font-medium">Brands</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`brand-${brand.id}`} 
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={() => toggleBrand(brand.id)}
                  />
                  <Label 
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {brand.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ratings">
          <AccordionTrigger className="font-medium">Ratings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {ratings.map((rating) => (
                <div key={rating.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`rating-${rating.id}`} 
                    checked={selectedRatings.includes(rating.id)}
                    onCheckedChange={() => toggleRating(rating.id)}
                  />
                  <Label 
                    htmlFor={`rating-${rating.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {rating.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={resetFilters}
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default ProductFilters;