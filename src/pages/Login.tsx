import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function Login() {
    const navigate = useNavigate();
    const [loginCode, setLoginCode] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        if (!loginCode || pin.length < 6) {
            setErrorMessage('로그인 코드와 6자 이상 비번을 입력해주세요.');
            return;
        }
        setLoading(true);
        setErrorMessage('');

        // 로그인 처리를 위한 Edge Function 호출
        // (주의: 로컬 Edge Function 환경에 'login' 함수가 배포되어 있어야 작동합니다)
        const { data, error } = await supabase.functions.invoke('login', {
            body: { login_code: loginCode, pin },
        });

        setLoading(false);
        if (error) {
            setErrorMessage(`로그인 실패: ${error.message}`);
        } else if (data?.success) {
            // 로그인 성공 처리 (예: 메인 페이지로 이동)
            localStorage.setItem('mdx_user', JSON.stringify(data.user));
            alert(`${data.user.display_name}님, 환영합니다!`);
            navigate('/'); 
        } else {
             setErrorMessage('로그인 정보를 확인해주세요.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">로그인</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">로그인 코드</label>
                        <input
                            type="text"
                            placeholder="MDX-XXXX-XXXX"
                            value={loginCode}
                            onChange={(e) => setLoginCode(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">PIN</label>
                        <input
                            type="password"
                            placeholder="6자리 비번"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="w-full p-2 border rounded"
                            maxLength={20}
                        />
                    </div>
                    {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </button>
                    <div className="text-center">
                        <button
                            onClick={() => navigate('/signup')}
                            className="text-sm text-blue-500 hover:underline"
                        >
                            계정이 없으신가요? 회원가입
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;