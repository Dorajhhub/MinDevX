import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

type Step = 'age' | 'info' | 'pin' | 'success';

function SignUp() {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('age');
    const [birthDate, setBirthDate] = useState({ year: '', month: '', day: '' });
    const [nickname, setNickname] = useState('');
    const [loginCode, setLoginCode] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleAgeCheck = () => {
        const { year, month, day } = birthDate;
        if (!year || !month || !day || isNaN(parseInt(year)) || isNaN(parseInt(month)) || isNaN(parseInt(day))) {
            setErrorMessage('유효한 생년월일을 모두 입력해주세요.');
            return;
        }

        const birth = new Date(Number(year), Number(month) - 1, Number(day));
        const today = new Date();
        
        // 14년 전 날짜
        const fourteenYearsAgo = new Date(today.getFullYear() - 14, today.getMonth(), today.getDate());

        if (birth <= fourteenYearsAgo) {
            setStep('info');
            setErrorMessage('');
        } else {
            setErrorMessage('만 14세 미만은 가입할 수 없습니다.');
        }
    };

    const handleGenerateCode = async () => {
        if (nickname.trim() === '') {
            setErrorMessage('닉네임을 입력해주세요.');
            return;
        }
        setLoading(true);
        setErrorMessage('');

        // Supabase Edge Function 호출
        const { data, error } = await supabase.functions.invoke('generate-login-code', {
            body: {nickname: nickname.trim()}, // 현재 닉네임은 다음 단계에서 전송
        });

        setLoading(false);
        if (error) {
            console.log(error)
            // 서버가 보낸 "NICKNAME_ALREADY_TAKEN"을 여기서 처리!
            if (error.message.includes('ALREADY_EXISTS_NICKNAME')) {
            setErrorMessage('이미 사용 중인 닉네임입니다. 다른 이름을 입력해주세요.');
            } else {
            setErrorMessage('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
        } else {
            setLoginCode(data?.loginCode || '');
            setStep('pin');
        }
    };

    const handleCreateAccount = async () => {
        if (pin.length < 6) {
            setErrorMessage('비번은 6자리 이상으로 입력해주세요.');
            return;
        }
        setLoading(true);
        setErrorMessage('');

        // Supabase Edge Function 호출
        const { error } = await supabase.functions.invoke('create-account', {
            body: {
                login_code: loginCode,
                display_name: nickname,
                pin: pin,
                is_verified_age: true
            },
        });

        setLoading(false);
        if (error) {
            setErrorMessage(`가입 오류: ${error.message}`);
        } else {
            setStep('success');
        }
    };

    const renderAgeStep = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">연령 확인</h2>
            <p>서비스 이용을 위해 만 14세 이상인지 확인합니다.</p>
            <div className="flex space-x-2">
                <input
                    type="number"
                    placeholder="YYYY"
                    value={birthDate.year}
                    onChange={(e) => setBirthDate({ ...birthDate, year: e.target.value })}
                    className="w-1/3 p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="MM"
                    value={birthDate.month}
                    onChange={(e) => setBirthDate({ ...birthDate, month: e.target.value })}
                    className="w-1/3 p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="DD"
                    value={birthDate.day}
                    onChange={(e) => setBirthDate({ ...birthDate, day: e.target.value })}
                    className="w-1/3 p-2 border rounded"
                />
            </div>
            <button onClick={handleAgeCheck} className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                확인
            </button>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
    );

    const renderInfoStep = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">회원가입</h2>
            <p className="text-sm text-gray-600">
                닉네임에는 개인정보를 포함하거나 불쾌감을 주는 단어를 사용하지 마세요.
            </p>
            <input
                type="text"
                placeholder="닉네임 입력"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full p-2 border rounded"
            />
            <button onClick={handleGenerateCode} disabled={loading} className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400">
                {loading ? '코드를 생성 중...' : '가입 계속하기'}
            </button>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
    );

    const renderPinStep = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">PIN 설정</h2>
            <p>로그인 코드가 발급되었습니다! 계정을 보호하기 위해 6자리 이상의 비번을 설정하세요.</p>
            <div className="p-4 text-center bg-gray-100 rounded">
                <p className="text-gray-600">나의 로그인 코드</p>
                <p className="text-2xl font-mono font-bold">{loginCode}</p>
            </div>
            <input
                type="password"
                placeholder="6자리 이상 비번"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={20}
                className="w-full p-2 border rounded"
                autoComplete="new-password"
            />
            <button onClick={handleCreateAccount} disabled={loading} className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600 disabled:bg-gray-400">
                {loading ? '가입 완료 중...' : '가입 완료하기'}
            </button>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
    );

    const renderSuccessStep = () => (
        <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-green-600">🎉 회원가입 완료!</h2>
            <p>MinDevX에 오신 것을 환영합니다!</p>
            <div className="p-4 bg-gray-100 rounded">
                <p className="text-gray-600">로그인 시 아래 코드를 사용하세요.</p>
                <p className="text-2xl font-mono font-bold">{loginCode}</p>
            </div>
            <p>이제 로그인 페이지로 이동하여 로그인할 수 있습니다.</p>
            <button onClick={() => navigate('/login')} className="w-full p-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600">
                로그인 하러 가기
            </button>
        </div>
    );

    const renderContent = () => {
        switch (step) {
            case 'age':
                return renderAgeStep();
            case 'info':
                return renderInfoStep();
            case 'pin':
                return renderPinStep();
            case 'success':
                return renderSuccessStep();
            default:
                return renderAgeStep();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                {renderContent()}
            </div>
        </div>
    );
}

export default SignUp;