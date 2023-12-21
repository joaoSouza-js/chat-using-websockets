import { DashboardMessages } from '@/components/dashboard';
import { Home } from '@/pages/Home';
import { SearchUser } from '@/pages/SearchUser';
import { SignIn } from '@/pages/SignIn';
import { SignUp } from '@/pages/SignUp';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path='/searchUser' element={<SearchUser/>} />
                <Route path='/home' element={<DashboardMessages />}>
                    <Route path='messages/:chatId' element={<Home />} />
                </Route>
            </Routes>
        </BrowserRouter>

    )
}