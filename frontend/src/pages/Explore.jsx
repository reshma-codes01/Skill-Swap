import React from 'react';
import SearchBar from '../components/SearchBar';
import SkillFeed from '../components/SkillFeed';
import PageWrapper from '../components/PageWrapper';

export default function Explore() {
  return (
    <PageWrapper>
      <div className="flex flex-col w-full">
      <SearchBar />
      <SkillFeed />
      </div>
    </PageWrapper>
  );
}
