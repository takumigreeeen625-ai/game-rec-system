import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Gamepad2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { fetchApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './auth.css';

export default function Register() {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const data = await fetchApi('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, displayName }),
            });

            login(data.token, data.user);
            navigate('/');
        } catch (error: any) {
            setErrorMsg(error.message || '登録に失敗しました');
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
                    <h1>Create Account</h1>
                    <p>新しいアカウントを作成して、ゲームライブラリを統合しましょう。</p>
                </div>

                {errorMsg && <div style={{ color: 'var(--status-danger)', marginBottom: '1rem', textAlign: 'center' }}>{errorMsg}</div>}

                <form onSubmit={handleRegister} className="auth-form">
                    <Input
                        label="表示名 (ニックネーム)"
                        type="text"
                        placeholder="ゲーマーネーム"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                    />
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
                        placeholder="•••••••• (8文字以上)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        leftIcon={<UserPlus size={20} />}
                        disabled={isLoading}
                        style={{ marginTop: '1rem' }}
                    >
                        {isLoading ? '登録中...' : 'アカウント登録'}
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>すでにアカウントをお持ちですか？ <Link to="/login">ログイン</Link></p>
                </div>
            </div>
        </div>
    );
}
