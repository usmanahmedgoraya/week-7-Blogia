'use client'
import {
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
    SolutionOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}


// ... (your imports)

const Drawers: React.FC = () => {
    const [user, setUser] = useState<any>();
    const router  = useRouter()

    useEffect(() => {
        const isAuthExist: any = localStorage.getItem('Auth');
        const Auth: any = JSON.parse(isAuthExist);
        const user: any = Auth?.state?.user;
        setUser(user);
    }, []);

    const generateMenuItems = (): MenuItem[] => {
        // Default items that are common for all roles
        const defaultItems: MenuItem[] = [
            getItem('Profile', '1', <PieChartOutlined />),
            getItem('Logout', '3', <LogoutOutlined />)
        ];

        // Check if the user has a role of "writer"
        if (user?.role === 'writer') {
            // Include "Blogs" item for the "writer" role
            return [...defaultItems, getItem('Blogs', '2', <SolutionOutlined />)];
        }

        // Return default items for other roles
        return defaultItems;
    };

    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const handleLogout = (key: React.Key) => {
        if (key === '3') { // '3' is the key for the Logout menu item
            localStorage.clear();
            router.push('/auth/login')
        }
    };

    const items: MenuItem[] = generateMenuItems();

    return (
        <div style={{ width: 256 }} className='absolute top-20 flex flex-col items-baseline'>
            <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
            <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                theme="dark"
                inlineCollapsed={collapsed}
                items={items}
                className='min-h-screen'
                onClick={(e) => handleLogout(e?.key as React.Key)}
            />
        </div>
    );
};

export default Drawers;
