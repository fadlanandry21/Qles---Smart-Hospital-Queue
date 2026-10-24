import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight, 
  User, 
  Tag, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';
import { blogCategories, blogArticles } from '../data/blogData';
import Card, { CardBody, CardFooter } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import FormField from '../components/common/FormField';
import Reveal from '../components/common/Reveal';
import './BlogPage.css';

export function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredArticle = blogArticles.find(a => a.featured) || blogArticles[0];

  const filteredGridArticles = useMemo(() => {
    return blogArticles.filter((article) => {
      // Don't show featured in grid unless searching
      if (!searchQuery && selectedCategory === 'Semua' && article.id === featuredArticle.id) {
        return false;
      }

      const matchCat = selectedCategory === 'Semua' || article.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.tags.some(t => t.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery, featuredArticle]);

  return (
    <div className="page-container blog-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <span className="page-badge">Edukasi & Tips Kesehatan</span>
          <h1 className="page-title">Wawasan Medis & Informasi Antrean</h1>
          <p className="page-subtitle">
            Artikel ilmiah populer dari dokter spesialis RS Qless untuk hidup lebih sehat, bugar, dan terencana.
          </p>
        </div>

        {/* 1. Featured Article Hero (UX Requirement: Featured + Grid) */}
        {!searchQuery && selectedCategory === 'Semua' && featuredArticle && (
          <Reveal direction="up">
            <div className="featured-article-hero">
              <div className="featured-hero-image-wrapper">
                <img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  className="featured-hero-image"
                />
                <div className="featured-pill-tag">
                  <Sparkles size={13} />
                  <span>ARTIKEL PILIHAN UTAMA</span>
                </div>
              </div>

              <div className="featured-hero-content">
                <div className="featured-meta-row">
                  <Badge variant="primary" size="sm">
                    {featuredArticle.category}
                  </Badge>
                  <span className="featured-read-time">
                    <Clock size={13} /> {featuredArticle.readTime}
                  </span>
                  <span className="featured-date">
                    <Calendar size={13} /> {featuredArticle.date}
                  </span>
                </div>

                <h2 className="featured-title">
                  <Link to={`/blog/${featuredArticle.slug}`}>
                    {featuredArticle.title}
                  </Link>
                </h2>

                <p className="featured-excerpt">
                  {featuredArticle.excerpt}
                </p>

                <div className="featured-author-footer">
                  <div className="author-block">
                    <img
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      className="author-avatar-sm"
                    />
                    <div>
                      <strong className="author-name-text">{featuredArticle.author.name}</strong>
                      <span className="author-role-text">{featuredArticle.author.role}</span>
                    </div>
                  </div>

                  <Button
                    as={Link}
                    to={`/blog/${featuredArticle.slug}`}
                    variant="primary"
                    size="md"
                    iconRight={<ArrowRight size={16} />}
                  >
                    Baca Selengkapnya
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* Search & Category Filter */}
        <div className="blog-filter-section">
          <div className="blog-search-box">
            <FormField
              placeholder="Cari topik kesehatan, tips jantung, anak, antrean..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              iconLeft={<Search size={18} />}
            />
          </div>

          <div className="filter-tabs-wrapper">
            {blogCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Grid Articles */}
        <div className="blog-grid-section">
          {filteredGridArticles.length === 0 ? (
            <div className="no-articles-card">
              <BookOpen size={40} className="text-muted" />
              <h3>Artikel Tidak Ditemukan</h3>
              <p>Tidak ada artikel yang cocok dengan kata kunci "{searchQuery}".</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedCategory('Semua');
                  setSearchQuery('');
                }}
              >
                Lihat Semua Artikel
              </Button>
            </div>
          ) : (
            <div className="blog-posts-grid">
              {filteredGridArticles.map((article, idx) => (
                <Reveal key={article.id} direction="up" delay={(idx % 6) * 100}>
                  <Card interactive className="blog-card">
                    <div className="blog-card-image-box">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="blog-card-image"
                        loading="lazy"
                      />
                      <span className="blog-cat-badge">
                        {article.category}
                      </span>
                    </div>

                    <CardBody className="blog-card-body">
                      <div className="blog-card-meta">
                        <span><Clock size={12} /> {article.readTime}</span>
                        <span>•</span>
                        <span>{article.date}</span>
                      </div>

                      <h3 className="blog-card-title">
                        <Link to={`/blog/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>

                      <p className="blog-card-excerpt">
                        {article.excerpt}
                      </p>
                    </CardBody>

                    <CardFooter className="blog-card-footer">
                      <div className="blog-author-mini">
                        <img
                          src={article.author.avatar}
                          alt={article.author.name}
                          className="author-avatar-xs"
                        />
                        <span className="author-mini-name">{article.author.name}</span>
                      </div>

                      <Link to={`/blog/${article.slug}`} className="read-more-link">
                        Baca <ArrowRight size={14} />
                      </Link>
                    </CardFooter>
                  </Card>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
