/* eslint-disable no-undef */
'use client';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.css';
import { Container, HeroPage } from '../components/Foundation';
import { getPost } from '../graphql/queries';
import { LastPosts } from '@/app/components/Elements';
import { useQuery } from '@apollo/client';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MarkdownIt from 'markdown-it';

export default function Post() {
  const router = useRouter();
  const md = new MarkdownIt();
  const [content, setContent] = useState();
  const [data, setData] = useState({});
  const path = usePathname().slice(1);
  useQuery(getPost, {
    variables: { slug: path },
    onCompleted: (data) => {
      setContent(md.render(data?.blogPosts?.data[0]?.attributes?.content));
      setData(data?.blogPosts?.data[0]?.attributes);
    }
  });

  return (
    <main>
      <HeroPage arrow={false} cta={false} mini={true} uri="/bg-blog.svg" />
      <Container newClasses="py-12 lg:py-24">
        <header className="border-b col-span-12 grid lg:grid-cols-12 grid-cols-4 gap-6 pb-4">
          <div
            className="col-span-2 flex items-center"
            onClick={() => router.back()}
          >
            <FontAwesomeIcon
              className="text-custom-orange"
              icon={faChevronLeft}
            />
            <button
              className="font-sans ml-4 text-sm text-soft-gray"
              type="button"
            >
              voltar para o blog
            </button>
          </div>
          <div className="col-span-2 lg:col-span-10 flex justify-end">
            <p className="font-sans text-sm text-soft-gray">
              Escrito por Sempre Tecnologia,{' '}
              {new Date(data?.publishedAt).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </header>
        <div className="col-span-12 grid lg:grid-cols-12 grid-cols-4 gap-6">
          <h1 className="col-span-4 lg:col-span-8 lg:col-start-3 font-serif font-bold my-8 text-center text-dark-blue text-5xl">
            {data?.title}
          </h1>
          <div className="col-span-4 lg:col-span-8 lg:col-start-3 flex justify-center mb-8">
            <img
              alt={data?.title}
              src={`${data?.image?.data?.attributes?.url}`}
            />
          </div>
          <div
            className={`${styles.content} col-span-4 lg:col-span-8 lg:col-start-3`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </Container>
      <section style={{ backgroundColor: '#F8F8F8' }}>
        <Container newClasses="pb-12 lg:pb-24">
          <LastPosts />
        </Container>
      </section>
    </main>
  );
}
