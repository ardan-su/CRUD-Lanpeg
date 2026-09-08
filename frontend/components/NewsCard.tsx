import React from 'react';
import { Link } from 'react-router-dom';
import { type NewsArticle } from '../types';

interface NewsCardProps {
    article: NewsArticle;
    onReadMore?: () => void;
    basePath?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, basePath = '/informasi/berita' }) => {
    const fallbackImage = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop&q=80';
    const imageUrl = article.image
        ? (article.image.startsWith('http')
            ? article.image
            : `http://localhost:5001/public/uploads/${article.image}`)
        : fallbackImage;

    return (
        <article className="group bg-white rounded-3xl overflow-hidden shadow-card card-lift border border-neutral-100/80 flex flex-col h-full">

            {/* Image */}
            <div className="relative overflow-hidden h-52 shrink-0">
                <img
                    src={imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
                />
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                    <span className="inline-block bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                        {article.category}
                    </span>
                </div>
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-6">
                {/* Date */}
                <div className="flex items-center gap-1.5 text-neutral-400 text-xs mb-3">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">{article.date}</span>
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-neutral-900 text-base leading-snug mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                    <Link to={`${basePath}/${article.slug}`}>
                        {article.title}
                    </Link>
                </h3>

                {/* Excerpt */}
                {article.description && (
                    <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
                        {article.description}
                    </p>
                )}

                {/* Read more */}
                <div className="mt-auto pt-4 border-t border-neutral-100">
                    <Link
                        to={`${basePath}/${article.slug}`}
                        className="inline-flex items-center gap-1.5 text-primary font-bold text-sm hover:text-primary-dark transition-colors group/link"
                    >
                        Baca Selengkapnya
                        <svg className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default NewsCard;
