'use client'
import Comments from '@/components/Comment/Comments';
import useBlogStore from '@/zustand/useBlogStore';
import { ReactionBarSelector } from '@charkour/react-reactions';
import HTMLReactParser from 'html-react-parser/lib/index';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Correct import statement for useRouter
import { useEffect, useState } from 'react';

const Page = ({ params }: { params: { id: string } }) => { // Renamed 'page' to 'Page'
  const router = useRouter();
  const [reactionCounts, setReactionCounts] = useState({
    happy: 0,
    satisfaction: 0,
    sad: 0,
    love: 0,
    surprise: 0,
    angry: 0,
  });
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [user, setUser] = useState<any>();

  const { getSingleBlog, singleBlog, giveReaction } = useBlogStore();

  useEffect(() => {
    const isAuthExist: any = localStorage.getItem('Auth');
    const Auth: any = JSON.parse(isAuthExist);
    const user: any = Auth?.state?.user;
    setUser(user);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const counts: any = await getSingleBlog(params.id);
      setUserReaction(counts?.userReaction?.reactionType);
      setReactionCounts({
        happy: counts?.reactionCounts?.happy || 0,
        satisfaction: counts?.reactionCounts?.satisfaction || 0,
        sad: counts?.reactionCounts?.sad || 0,
        love: counts?.reactionCounts?.love || 0,
        surprise: counts?.reactionCounts?.surprise || 0,
        angry: counts?.reactionCounts?.angry || 0,
      });
    };

    fetchData();
  }, [params.id]);

  const formatDate = (): string => {
    const dateString = singleBlog.createdAt;
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
  };

  const handleReaction = (key: string) => {
    if (userReaction === key) {
      giveReaction(key, params.id);
      setUserReaction(null);
      setReactionCounts((prevCounts: any) => ({
        ...prevCounts,
        [key]: prevCounts[key] - 1,
      }));
    } else if (!userReaction) {
      giveReaction(key, params.id);
      setUserReaction(key);
      setReactionCounts((prevCounts: any) => ({
        ...prevCounts,
        [key]: prevCounts[key] + 1,
      }));
    } else {
      giveReaction(key, params.id);
      setReactionCounts((prevCounts: any) => ({
        ...prevCounts,
        [userReaction]: prevCounts[userReaction] - 1,
      }));
      setUserReaction(key);
      setReactionCounts((prevCounts: any) => ({
        ...prevCounts,
        [key]: prevCounts[key] + 1,
      }));
    }
  };

  return (
    <div className='flex justify-center px-2'>
      <div className='flex items-start relative flex-col w-full max-w-[50rem] mt-10'>
        <h1 className='md:text-6xl font-bold'>{singleBlog?.title}</h1>
        <div className="divider w-full"></div>
        <div className='flex justify-start flex-col'>
          {singleBlog?.user?.profileImage && (
            <div className='flex items-center gap-x-2 my-4 '>
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <Image alt="Tailwind CSS Navbar component" src={singleBlog?.user?.profileImage || 'https://res.cloudinary.com/dyunqrxki/image/upload/v1706250956/lnha0zjnpjwctkmm1p4u.png'} width={80} height={80} className="w-auto h-auto" />
                </div>
              </div>
              <div>
                <h1>{singleBlog?.user?.name}</h1>
                <p>{formatDate()}</p>
              </div>
            </div>
          )}
        </div>
        <div className='w-full h-auto bg-cover'>
          <img
            className='rounded w-full'
            src={singleBlog?.image}
            alt={singleBlog?.title}
          />
        </div>
        <div className='mt-7 w-full'>
          {HTMLReactParser(singleBlog?.description) }
        </div>
        <div className='mt-6 flex flex-col md:flex-row justify-center md:justify-between items-center w-full gap-2'>
          {user?.role === 'user' && (
            <ReactionBarSelector style={{ background: "#1D232A", padding: '10px', border: '2px solid #ffffff' }} iconSize={25} onSelect={handleReaction} />
          )}
          <div className='flex flex-wrap space-x-3'>
            {reactionCounts.happy > 0 && <span className='flex flex-col items-center'><span>😆</span> {reactionCounts.happy}</span>}
            {reactionCounts.satisfaction > 0 && <span className='flex flex-col items-center'><span>👍</span>{reactionCounts.satisfaction}</span>}
            {reactionCounts.sad > 0 && <span className='flex flex-col items-center'><span>😢</span>{reactionCounts.sad}</span>}
            {reactionCounts.love > 0 && <span className='flex flex-col items-center'><span>❤️</span> {reactionCounts.love}</span>}
            {reactionCounts.surprise > 0 && <span className='flex flex-col items-center'><span>😮</span> {reactionCounts.surprise}</span>}
            {reactionCounts.angry > 0 && <span className='flex flex-col items-center'><span>😡</span> {reactionCounts.angry}</span>}
          </div>
        </div>
        <div className="divider"></div>
        {singleBlog?.comments && (
          <Comments comments={singleBlog.comments} blogId={singleBlog?._id} />
        )}
      </div>
    </div>
  );
}

export default Page;
