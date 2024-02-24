'use client'
import useBlogStore from "@/zustand/useBlogStore";
import useUserStore from "@/zustand/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IconType } from "react-icons";
import { BiSolidExit } from "react-icons/bi";
import { CgUnblock } from "react-icons/cg";
import { FaUserEdit, FaUsers } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { GoStop } from "react-icons/go";
import { MdOutlineAdminPanelSettings, MdPending } from "react-icons/md";
import { RiArticleFill } from "react-icons/ri";
import { VscPass } from "react-icons/vsc";

const DashboardCard = () => {
    const { Approved, Disapproved, pendings, blogs, getAllBlog } = useBlogStore()
    const { getAllUsers, users } = useUserStore()

    useEffect(() => {
        getAllBlog()
        getAllUsers()
    }, [])

    return (
        <div className="p-4">
            {/* <p className="text-xl font-semibold mb-2">Settings</p> */}
            {users && users?.length > 0 && <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card
                    title="Total Users"
                    subtitle={users && users?.length}
                    href="#"
                    Icon={FiUser}
                />
                <Card
                    title="Blocked Users"
                    subtitle={users && users?.filter((user: any) => user?.userStatus === 'Block').length}
                    href="#"
                    Icon={GoStop}
                />
                <Card
                    title="Unblocked Users"
                    subtitle={users && users?.filter((user: any) => user?.userStatus === 'Unblock').length}
                    href="#"
                    Icon={CgUnblock}
                />
                <Card title="Total Blogs" subtitle={blogs?.length} href="#" Icon={RiArticleFill} />
                <Card title="Pendings" subtitle={pendings?.length} href="#" Icon={MdPending} />
                <Card
                    title="Approved"
                    subtitle={Approved?.length}
                    href="#"
                    Icon={VscPass}
                />
                <Card
                    title="Disapproved"
                    subtitle={Disapproved?.length}
                    href="#"
                    Icon={BiSolidExit}
                />
                <Card
                    title="Admins"
                    subtitle={users && users?.filter((user: any) => user?.role === 'admin').length}
                    href="#"
                    Icon={MdOutlineAdminPanelSettings}
                />
                <Card
                    title="Users"
                    subtitle={users && users?.filter((user: any) => user?.role === 'user').length}
                    href="#"
                    Icon={FaUsers}
                />
                <Card
                    title="Writers"
                    subtitle={users && users?.filter((user: any) => user?.role === 'writer').length}
                    href="#"
                    Icon={FaUserEdit}
                />
            </div>}
        </div>
    );
};

interface CardType {
    title: string;
    subtitle: number;
    Icon: IconType;
    href: string;
}

const Card = ({ title, subtitle, Icon, href }: CardType) => {
    return (
        <a
            href={href}
            className="w-full p-4 rounded border-[1px] border-slate-300 relative overflow-hidden group bg-white"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-pink-600  to-cyan-500 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />

            <Icon className="absolute z-10 -top-12 -right-12 text-9xl text-slate-100 group-hover:text-violet-400 group-hover:rotate-12 transition-transform duration-300" />
            <Icon className="mb-2 text-2xl text-pink-600 group-hover:text-white transition-colors relative z-10 duration-300" />
            <h3 className="font-medium text-lg text-slate-950 group-hover:text-white relative z-10 duration-300">
                {title}
            </h3>
            <p className="text-slate-400 group-hover:text-violet-200 relative z-10 duration-300 text-4xl font-bold">
                {subtitle}
            </p>
        </a>
    );
};

export default DashboardCard;