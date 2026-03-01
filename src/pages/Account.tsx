import { useState, useEffect } from 'react';

interface MdxUser {
  display_name: string;
  mdx_id: string;
  // 필요한 필드를 여기에 더 추가하시면 됩니다.
}

function Account() {
    const [user, setUser] = useState<MdxUser | null>(null);
    useEffect(() => {
        // 1. 저장된 문자열 가져오기
        const savedUser = localStorage.getItem('mdx_user');
        
        if (savedUser) {
            // 2. 객체로 변환해서 상태에 저장
            setUser(JSON.parse(savedUser));
        }
    }, []);

    if (!user) {
        return <div>로그인이 필요합니다.</div>;
    }
    
    return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">
        {user.display_name}님의 계정입니다.
      </h2>
      <p className="text-gray-500 mt-2">환영합니다, {user.display_name}님! MinDevX와 함께할 준비가 되셨나요?</p>
      
      {/* 로그아웃 버튼 예시 */}
      <button 
        onClick={() => { localStorage.removeItem('mdx_user'); window.location.reload(); }}
        className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
      >
        로그아웃
      </button>
    </div>
  );
}

export default Account;