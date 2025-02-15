/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'

import { readingTime as readingTimeHelper } from '@lib/readingTime'
import { resolveUrl } from '@utils/routing'
import { getLang, get } from '@utils/use-lang'

import { AuthorList } from '@components/AuthorList'
import { PostClass } from '@helpers/PostClass'
import { collections } from '@lib/collections'
import { GhostPostOrPage, GhostSettings } from '@lib/ghost'
//import star icon from react-icons
import { BsStarFill } from 'react-icons/bs'

interface PostCardProps {
  settings: GhostSettings
  post: GhostPostOrPage
  num?: number
  isHome?: boolean
  isBranded?: boolean
}

export const PostCard = ({ settings, post, num, isHome, isBranded }: PostCardProps) => {
  const { nextImages } = settings.processEnv
  const text = get(getLang(settings.lang))
  const cmsUrl = settings.url
  const collectionPath = collections.getCollectionByNode(post)
  const url = resolveUrl({ cmsUrl, collectionPath, slug: post.slug, url: post.url })
  const featImg = post.featureImage
  const readingTime = readingTimeHelper(post).replace(`min read`, text(`MIN_READ`))
  const postClass = PostClass({ tags: post.tags, isFeatured: post.featured, isImage: !!featImg })
  const large = (featImg && isHome && num !== undefined && 0 === num % 6 && `post-card-large`) || ``
  const authors = post?.authors?.filter((_, i) => (i < 2 ? true : false))

  return (
    <article className={`post-card ${postClass} ${large}`}>
      {featImg && (
        <Link href={url}>
          <a className="post-card-image-link" aria-label={post.title}>
            {nextImages.feature ? (
              <div className="post-card-image">
                <Image
                  src={featImg.url}
                  alt={post.title}
                  sizes="(max-width: 640px) 320px, (max-width: 1000px) 500px, 680px"
                  layout="fill"
                  objectFit="cover"
                  quality={nextImages.quality}
                />
              </div>
            ) : (
              post.feature_image && <img className="post-card-image" src={post.feature_image} alt={post.title} />
            )}
          </a>
        </Link>
      )}
      {/* show branded tag only for small image */}
      <div className="post-card-content">
        <Link href={url}>
          <a className="post-card-content-link">
            {isBranded && (
              <div className="post-card-branded">
                <span className="post-card-branded-text"><BsStarFill style={{ margin: "0 5px" }} />{text(`BRANDED`)}</span>
              </div>
            )}
            <header className="post-card-header">
              {post.primary_tag &&
                <div className="w-[75px] min-h-min min-w-min text-white text-center text-lg font-semibold border border-solid border-gray-100 rounded-[22px] my-4 px-6 py-2">
                  {post.primary_tag.name}
                </div>
              }
              <h2 className="post-card-title">{post.title}</h2>
            </header>
            <section className="post-card-excerpt">
              {/* post.excerpt *is* an excerpt and does not need to be truncated any further */}
              <p>{post.excerpt}</p>
            </section>
          </a>
        </Link>

        <footer className="post-card-meta">
          <AuthorList {...{ settings, authors: post.authors }} />
          <div className="post-card-byline-content">
            {post.authors && post.authors.length > 2 && <span>{text(`MULTIPLE_AUTHORS`)}</span>}
            {post.authors && post.authors.length < 3 && (
              <span>
                {authors?.map((author, i) => (
                  <div key={i}>
                    {i > 0 ? `, ` : ``}
                    <Link href={resolveUrl({ cmsUrl, slug: author.slug, url: author.url || undefined })}>
                      <a>{author.name}</a>
                    </Link>
                  </div>
                ))}
              </span>
            )}
            <span className="post-card-byline-date">
              <time dateTime={post.published_at || ''}>{dayjs(post.published_at || '').format('D MMM YYYY')}&nbsp;</time>
              <span className="bull">&bull; </span> {readingTime}
            </span>
          </div>
        </footer>
      </div>
    </article>
  )
}
