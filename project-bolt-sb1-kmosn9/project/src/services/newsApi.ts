import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

const RSS_FEEDS = [
  {
    url: 'https://www.bloomberght.com/rss',
    name: 'Bloomberg HT'
  },
  {
    url: 'https://www.dunya.com/rss',
    name: 'Dünya'
  },
  {
    url: 'https://www.paraanaliz.com/feed/',
    name: 'Para Analiz'
  }
];

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
});

const cleanHtml = (html: string) => {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
};

const getDefaultImage = (source: string) => {
  const images = {
    'Bloomberg HT': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500',
    'Dünya': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500',
    'Para Analiz': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500'
  };
  return images[source as keyof typeof images] || images['Bloomberg HT'];
};

export const getFinanceNews = async (): Promise<NewsItem[]> => {
  try {
    const allNews: NewsItem[] = [];

    await Promise.all(
      RSS_FEEDS.map(async (feed) => {
        try {
          const response = await axios.get(feed.url);
          const result = parser.parse(response.data);
          
          const items = result.rss.channel.item;
          const newsItems: NewsItem[] = items.slice(0, 10).map((item: any) => ({
            title: item.title,
            description: cleanHtml(item.description),
            url: item.link,
            urlToImage: item.enclosure?.['@_url'] || getDefaultImage(feed.name),
            publishedAt: new Date(item.pubDate).toISOString(),
            source: {
              name: feed.name
            }
          }));

          allNews.push(...newsItems);
        } catch (error) {
          console.error(`Error fetching ${feed.name} RSS:`, error);
        }
      })
    );

    // Son 20 haberi tarihe göre sırala
    return allNews
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 20);
  } catch (error) {
    console.error('News fetch error:', error);
    throw new Error('Haberler alınamadı');
  }
};