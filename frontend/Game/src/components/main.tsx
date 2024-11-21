import { Link } from "react-router-dom";
import React from 'react';
import axios from 'axios';
 import '../App.css';
 import myImage from './free-icon-speech-bubble-2462719.png';
 import search from './free-icon-people-9942543.png'
 interface User {
    id: number;
    email: string;
    username
: string;

}
function Main(){
    const [user, setUser] = React.useState<User | null>(null);

    const fetchUserProfile = async (token:string) => {
        try {
          const response = await axios.get<User>('http://localhost:3000/user/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
          console.log(response.data.username);
          console.log(response.data)
        } catch (error) {
          console.error('Ошибка при получении профиля пользователя', error);
          setUser(null);
        } 
      };
    
      // Проверяем наличие токена при загрузке
      React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          fetchUserProfile(token);
        } 
      }, []);

    return(
<>
<div className = " containerMain">     
<div className="top-right">
<Link to = "people"> <div className="image-container">
      <img src={search} alt="Описание изображения" className="small-image" />
    </div>
    </Link>
<Link to = "chat"> <div className="image-container">
      <img src={myImage} alt="Описание изображения" className="small-image" />
    </div>
    </Link>
<Link className = 'l' to = "prof">           {user ? user.username: 'Гость'}</Link>
    </div>   
<div className="container">
            <h2>Добро пожаловать в игру!</h2>
            <div>Выберите уровень сложности:</div>
            <div className="buttons">
                <Link to='/level1'>
                    <button className="game-button">Уровень 1</button>
                </Link>
                <Link to='/level2'>
                    <button className="game-button">Уровень 2</button>
                </Link>
                <Link to='/level3'>
                    <button className="game-button">Уровень 3</button>
                </Link>
                <Link to='/level4'>
                    <button className="game-button">Уровень 4</button>
                </Link>
                <Link to='/level5'>
                    <button className="game-button">Уровень 5</button>
                </Link>
                <Link to='/levelown'>
                    <button className="game-button">Создай   уровень!</button>
                </Link>
            </div>
        </div>
        </div>
</>

    )
}
export default Main;