import React from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
const Profile = ()=>{

    const [score, setScore] = React.useState<number>(0);
    const [win, setWin] = React.useState<number>(0);
    const [loose, setloos] = React.useState<number>(0);
    const [user, setUser] = React.useState<string | null>(null);

    const fetchUserProfile = async (token: string) => {
        try {
          const response = await axios.get('http://localhost:3000/user/info', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.name);
          setScore(response.data.score);
          setWin(response.data.success);
          setloos(response.data.unsuccess);
    
          console.log(response.data); 
        } catch (error) {
          console.error('Ошибка при получении профиля пользователя', error);
        }
      };
    
      // Проверка наличия токена при загрузке компонента
      React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          fetchUserProfile(token);
        }
      }, []);

    return (
    <>
    <div className="cont">
            <div className="profile-card">
                <h2 className="profile-title">Профиль</h2>
                <div className="profile-item">Имя: {user}</div>
                <div className="profile-item">Число очков: {score}</div>
                <div className="profile-item">Количество правильных ответов: {win}</div>
                <div className="profile-item">Количество неправильных ответов: {loose}</div>
           {/*      <div className="profile-item">Число друзей: 50</div> */}
             <Link to = "/main">   <button className="back-button">Назад</button>      </Link>  
            </div>
        </div>
    </>
)
}

export default Profile;