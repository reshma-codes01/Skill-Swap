import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import SkillFeed from '../components/SkillFeed';
import PageWrapper from '../components/PageWrapper';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  return (
    <PageWrapper>
      <div className="flex flex-col w-full">
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
        <SkillFeed 
          searchQuery={searchQuery}
          activeCategory={activeCategory}
          sortOrder={sortOrder}
        />
      </div>
    </PageWrapper>
  );
}
