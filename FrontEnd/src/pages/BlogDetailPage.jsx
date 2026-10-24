import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Tag, 
  CalendarPlus
} from 'lucide-react';
import { blogArticles } from '../data/blogData';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Card, { CardBody } from '../components/common/Card';
import './BlogPage.css';

export function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const article = blogArticles.find(a => a.slug === id || a.id === id) || blogArticles[0];
  const relatedArticles = blogArticles.filter(a => a.id !== article.id).slice(0, 2);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan artikel berhasil disalin!');
    }
  };

  return (
    <div className="page-container blog-detail-page">
      <div className="container article-container">
        {/* Back Link */}
        <div className="article-top-nav">
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<ArrowLeft size={16} />}
            onClick={() => navigate('/blog')}
          >
            Kembali ke Daftar Artikel
          </Button>
        </div>

        {/* Article Header */}
        <div className="article-header">
          <div className="article-meta-badges">
            <Badge variant="primary" size="md">
              {article.category}
            </Badge>
            <span className="meta-info-item">
              <Clock size={14} /> {article.readTime}
            </span>
            <span className="meta-info-item">
              <Calendar size={14} /> {article.date}
            </span>
          </div>

          <h1 className="article-main-title">{article.title}</h1>

          {/* Author Bar */}
          <div className="article-author-bar">
            <div className="article-author-left">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="article-author-img"
              />
              <div>
                <strong className="article-author-name">{article.author.name}</strong>
                <span className="article-author-role">{article.author.role}</span>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              iconLeft={<Share2 size={15} />}
              onClick={handleShare}
            >
              Bagikan
            </Button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="article-cover-wrapper">
          <img
            src={article.coverImage}
            alt={article.title}
            className="article-cover-img"
          />
        </div>

        {/* Article Body Content */}
        <div className="article-content-layout">
          <div className="article-body-text">
            {article.content ? (
              <div
                className="article-html"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <p>{article.excerpt}</p>
            )}

            {/* Tags */}
            <div className="article-tags-group">
              <Tag size={15} className="text-muted" />
              {article.tags.map(tag => (
                <span key={tag} className="article-tag-item">
                  #{tag}
                </span>
              ))}
            </div>

            {/* In-article Appointment Banner */}
            <Card className="article-cta-box" elevated>
              <CardBody className="article-cta-body">
                <div>
                  <h3 className="cta-box-title">Ingin Berkonsultasi dengan Dokter Spesialis?</h3>
                  <p className="cta-box-desc">
                    Jadwalkan pemeriksaan Anda sekarang tanpa antrean konvensional di RS Qless.
                  </p>
                </div>
                <Button
                  as={Link}
                  to="/appointment"
                  variant="primary"
                  size="md"
                  iconLeft={<CalendarPlus size={16} />}
                >
                  Buat Janji Kunjungan
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Related Articles */}
        <div className="related-articles-section">
          <h3 className="related-title">Artikel Terkait Lainnya</h3>
          <div className="related-grid">
            {relatedArticles.map(rel => (
              <Card key={rel.id} interactive className="related-card">
                <CardBody>
                  <span className="text-primary font-bold text-sm">{rel.category}</span>
                  <h4 className="related-card-title">
                    <Link to={`/blog/${rel.slug}`}>{rel.title}</Link>
                  </h4>
                  <p className="related-card-excerpt">{rel.excerpt}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;
