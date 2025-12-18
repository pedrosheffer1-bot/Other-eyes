import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // O FinanceContext vai detectar o login automaticamente e redirecionar
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') setError("Email ou senha incorretos.");
      else if (err.code === 'auth/email-already-in-use') setError("Este email já está cadastrado.");
      else if (err.code === 'auth/weak-password') setError("A senha deve ter pelo menos 6 caracteres.");
      else setError("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-8 justify-center bg-[#F8F5F0]">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-black tracking-tight mb-2">
          {isLogin ? 'Bem-vindo!' : 'Criar Conta'}
        </h1>
        <p className="text-gray-500 font-medium">Seus dados salvos na nuvem.</p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">E-mail</label>
          <input 
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-white h-16 px-6 rounded-[24px] shadow-sm border-none focus:ring-2 focus:ring-[#2952E3] font-medium text-black"
            placeholder="seu@email.com"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Senha</label>
          <input 
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-white h-16 px-6 rounded-[24px] shadow-sm border-none focus:ring-2 focus:ring-[#2952E3] font-medium text-black"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        {error && <p className="text-red-500 text-sm font-bold ml-2">{error}</p>}

        <button 
          type="submit"
          disabled={loading}
          className="w-full h-16 bg-[#2952E3] text-white rounded-[24px] font-black text-lg shadow-xl shadow-[#2952E3]/20 mt-4 active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? 'CARREGANDO...' : (isLogin ? 'ENTRAR' : 'CADASTRAR')}
        </button>
      </form>

      <button 
        onClick={() => setIsLogin(!isLogin)}
        className="mt-8 text-gray-400 font-bold text-sm"
      >
        {isLogin ? 'NÃO TEM CONTA? CRIE AGORA' : 'JÁ TEM CONTA? FAÇA LOGIN'}
      </button>
    </div>
  );
};

export default Auth;
