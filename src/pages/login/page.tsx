import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTabStore } from '@/lib/store/tabs';

export default function LoginPage() {
  const navigate = useNavigate();
  const addTab = useTabStore((state) => state.addTab);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberLogin, setRememberLogin] = useState(false);
  const [clientIP, setClientIP] = useState('192.111.111.102');
  const [isLoading, setIsLoading] = useState(false);

  // 저장된 로그인 정보 불러오기
  useEffect(() => {
    const savedUserId = localStorage.getItem('savedUserId');
    const savedRemember = localStorage.getItem('rememberLogin');
    if (savedRemember === 'true' && savedUserId) {
      setUserId(savedUserId);
      setRememberLogin(true);
    }

    // 이미 로그인된 상태면 채권상담으로 이동
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/counseling/general-counseling/bond-counseling');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId.trim()) {
      alert('사용자 아이디를 입력해주세요.');
      return;
    }

    if (!password.trim()) {
      alert('패스워드를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    // 로그인 정보 저장 처리
    if (rememberLogin) {
      localStorage.setItem('savedUserId', userId);
      localStorage.setItem('rememberLogin', 'true');
    } else {
      localStorage.removeItem('savedUserId');
      localStorage.removeItem('rememberLogin');
    }

    // 로그인 처리 (실제 구현에서는 API 호출)
    // 데모용으로 간단히 처리
    setTimeout(() => {
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userId', userId);
      setIsLoading(false);

      // 채권상담 탭 추가 및 이동
      const bondCounselingPath = '/counseling/general-counseling/bond-counseling';
      addTab({
        id: bondCounselingPath,
        label: '채권상담',
        path: bondCounselingPath,
      });
      navigate(bondCounselingPath);
    }, 500);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative"
      style={{
        backgroundImage: 'url(/login/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 로그인 박스 컨테이너 */}
      <div className="flex items-end gap-0">
        {/* 로그인 폼 박스 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg px-8 py-12 w-[420px] relative z-10">
          {/* 로고 영역 */}
          <div className="flex items-center gap-2 mb-8">
            <img
              src="/login/text-logo.png"
              alt="JT 친애저축은행"
              className="h-6"
            />
            <span className="text-gray-300 text-lg -mt-1">|</span>
            <span className="text-gray-500 text-xl font-medium -mt-1">Jany system</span>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* 사용자 아이디 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                사용자 아이디
              </label>
              <Input
                type="text"
                placeholder="사용자 아이디를 입력해주세요."
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full h-11"
              />
            </div>

            {/* 패스워드 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                패스워드
              </label>
              <Input
                type="password"
                placeholder="패스워드를 입력해주세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11"
              />
            </div>

            {/* 로그인 정보 저장 & 단말 IP */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="rememberLogin"
                  checked={rememberLogin}
                  onCheckedChange={(checked) => setRememberLogin(checked as boolean)}
                />
                <label
                  htmlFor="rememberLogin"
                  className="text-sm font-semibold text-gray-600 cursor-pointer"
                >
                  로그인정보 저장
                </label>
              </div>
              <span className="text-sm text-gray-500">
                단말 IP : {clientIP}
              </span>
            </div>

            {/* 로그인 버튼 */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-16 bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium text-base"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </div>

        {/* 화살표 차트 이미지 */}
        <img
          src="/login/arrow-image.png"
          alt="성장 차트"
          className="w-[280px] h-auto -ml-2 mb-4 relative z-0"
        />
      </div>
    </div>
  );
}
