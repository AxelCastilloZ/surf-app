import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export interface BlogPost {
  id: string
  slug: string
  title: string
  title_en: string
  excerpt: string
  excerpt_en: string
  content: string
  content_en: string
  meta_description: string
  meta_description_en: string
  keywords: string
  cover_image: string | null
  cover_image_alt: string
  cover_image_alt_en: string
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

async function fetchBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (error) throw new Error('Error loading blog posts')
  return (data ?? []) as unknown as BlogPost[]
}

async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) return null
  return data as unknown as BlogPost
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: fetchBlogPosts,
    staleTime: 1000 * 60 * 5,
  })
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => fetchBlogPost(slug),
    staleTime: 1000 * 60 * 5,
    enabled: !!slug,
  })
}
