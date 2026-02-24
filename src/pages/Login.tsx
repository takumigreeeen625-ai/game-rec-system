import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Gamepad2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { fetchApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './auth.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const data = await fetchApi('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            login(data.token, data.user);
            navigate('/');
        } catch (error: any) {
            setErrorMsg(error.message || 'ログインに失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
            </div>

            <div className="auth-card glass-panel">
                <div className="auth-header">
                    <div className="auth-logo">
                        <Gamepad2 size={32} className="text-accent" />
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Game Rec System にログインして、あなただけの最適なゲームを見つけましょう。</p>
                </div>

                {errorMsg && <div style={{ color: 'var(--status-danger)', marginBottom: '1rem', textAlign: 'center' }}>{errorMsg}</div>}

                <form onSubmit={handleLogin} className="auth-form">
                    <Input
                        label="メールアドレス"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="パスワード"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="auth-actions">
                        <a href="#" className="forgot-password">パスワードをお忘れですか？</a>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        leftIcon={<LogIn size={20} />}
                        disabled={isLoading}
                    >
                        {isLoading ? 'ログイン中...' : 'ログイン'}
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>アカウントをお持ちでないですか？ <Link to="/register">新規登録</Link></p>
                </div>
            </div>
        </div>
    );
}
