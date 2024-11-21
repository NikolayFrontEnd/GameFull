import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const Level1 = () => {
    const [number, setNumber] = useState<number>(0);
    const [number2, setNumber2] = useState<number>(0);
    const [number3, setNumber3] = useState<number>(0);
    const [number4, setNumber4] = useState<number>(0);
    const [result, setResult] = useState<number>(0);
    const [userInput, setUserInput] = useState<number | string>('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [operation, setOperation] = useState<string>('+');
    const [currentTask, setCurrentTask] = useState<string>('none');
    const [round, setRound] = useState<number>(1);
    const [correctCount, setCorrectCount] = useState<number>(0);
    const [wrongCount, setWrongCount] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);

    // States for the memorization game
    const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
    const [userInputNumbers, setUserInputNumbers] = useState<string>('');
    const [isMemorizationCorrect, setIsMemorizationCorrect] = useState<boolean | null>(null);
    const [isNumbersVisible, setIsNumbersVisible] = useState<boolean>(false);


    // Timer state
    const [timer, setTimer] = useState<number>(10);
    const [gameStarted, setGameStarted] = useState<boolean>(false);

    useEffect(() => {
        // Таймер для отсчета времени до начала игры
        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        } else {
            setGameStarted(true);
        }
    }, [timer]);

    const changeNumber = (): number => {
        return Math.floor(Math.random() * (99 - 11 + 1)) + 11;
    };

    const changeNumber2 = (): number => {
        return Math.floor(Math.random() * (20 - 2 + 1)) + 2;
    };

    const generateArithmeticTask = () => {
        const newNumber = changeNumber();
        const newNumber2 = changeNumber();
        const newNumber3 = changeNumber2();
        const newNumber4 = changeNumber2();
        const randomOperation = Math.floor(Math.random() * 3);
        let op = '+';
        let res = 0;
        switch (randomOperation) {
            case 0:
                op = '+';
                res = newNumber + newNumber2;
                setNumber(newNumber);
                setNumber2(newNumber2);
                break;
            case 1:
                op = '-';
                res = newNumber - newNumber2;
                setNumber(newNumber);
                setNumber2(newNumber2);
                break;
            case 2:
                op = '*';
                res = newNumber3 * newNumber4;
                setNumber3(newNumber3);
                setNumber4(newNumber4);
                break;
        }
        setOperation(op);
        setResult(res);
        setIsCorrect(null);
        setUserInput('');
        setCurrentTask('arithmetic');
    };

    const generateMemorizationTask = () => {
        const numbers = Array.from({ length: 3 }, () => Math.floor(Math.random() * 200));
        setRandomNumbers(numbers);
        setIsNumbersVisible(true);

        setIsMemorizationCorrect(null);
        setUserInputNumbers('');
        setCurrentTask('memorization');

        setTimeout(() => {
            setIsNumbersVisible(false);

        }, 5000);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    const handleMemorizationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInputNumbers(event.target.value);
    };

    const CheckArithmeticRes = () => {
        if (userInput !== null && userInput !== '') {
            const isAnswerCorrect = Number(userInput) === result;
            setIsCorrect(isAnswerCorrect);

            if (isAnswerCorrect) {
                setCorrectCount((prev) => prev + 1);
            } else {
                setWrongCount((prev) => prev + 1);
            }

            proceedToNextRound();
        }
    };

    const CheckMemorizationRes = () => {
        const userNumbersArray = userInputNumbers.split(' ').map(Number);
        const isMatch = randomNumbers.every((num, index) => num === userNumbersArray[index]);
        setIsMemorizationCorrect(isMatch);

        if (isMatch) {
            setCorrectCount((prev) => prev + 1);
        } else {
            setWrongCount((prev) => prev + 1);
        }

        proceedToNextRound();
    };

    const proceedToNextRound = () => {
        setTimeout(() => {
        if (round < 10) {

                setRound((prev) => prev + 1);
                handleAnotherClick();
     
        } else {
            setGameOver(true);
        }
    }, 6000);
    };

    const handleAnotherClick = () => {
        const randomTask = Math.floor(Math.random() * 2);
        if (randomTask === 0) {
            generateArithmeticTask();
        } else {
            generateMemorizationTask();
        }
    };

    useEffect(() => {
        if (!gameOver && gameStarted) {
            handleAnotherClick();
        }
    }, [round, gameStarted]);

// логика по отправке результатов на бэк

interface GameResult {
    score: number;
    success: number;
    unsuccess: number;
  }

  const sendGameResult = async (token: string, correct: number, wrong: number) => {
    // Вычисление score на основе количества правильных ответов
    const score = correct > 5 ? 1 : 0;
    const result: GameResult = {
      score,
      success: correct,
      unsuccess: wrong,
    };

    try {
      const response = await axios.patch<GameResult>('http://localhost:3000/results/update', result, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Данные успешно отправлены:', response.data);
      // Обновление состояния профиля на основе ответа от бэкенда
    } catch (error: any) {
      console.error('Ошибка при отправке данных:', error.response?.data || error.message);
    }
  };
    
  const handleSendResult = () => {
    const token = localStorage.getItem('token');
    if (token) {
      sendGameResult(token, correctCount, wrongCount);
    } else {
      console.error('Отсутствует токен');
    }
  };
    return (
        <>
            <div className="container2">
            {!gameStarted ? (
                <h2 className="round-change">До начала игры осталось: {timer}</h2>
            ) : (
                <>
                    <h2 className="round-change">Уровень 1</h2>
                    <div className="round-change">Раунд: {round} из 10</div>
                    {gameOver ? (
                        <div>
                            <h3 className="round-change">Игра окончена!</h3>
                            <p className="round-change">Правильных ответов: {correctCount}</p>
                            <p className="round-change">Неправильных ответов: {wrongCount}</p>
                            <Link to ="/main"><button onClick = {handleSendResult} className = "button2" >Завершить</button></Link>  
                        </div>
                    ) : (
                        <>
                            {currentTask === 'arithmetic' && (
                                <div className="round-change">
                                    <h3>Посчитай:</h3>
                                    <div>
                                        {operation === '*'
                                            ? `${number3} ${operation} ${number4} = ?`
                                            : `${number} ${operation} ${number2} = ?`}
                                    </div>
                                    <input
                                        type='number'
                                        value={userInput}
                                        onChange={handleInputChange}
                                    />
                                    <button className = "button2" onClick={CheckArithmeticRes}>Проверить</button>
                                    {isCorrect === true && <div className="round-change">Правильно!</div>}
                                    {isCorrect === false && <div className="round-change">Неправильно! Правильный результат: {result}</div>}
                                </div>
                            )}
{currentTask === 'memorization' && (
    <div className="round-change">

        {isNumbersVisible ? (
            <h3>Тренировка памяти. Запомни эти числа:</h3>
        ) : (
            <h3>Напиши ответ:</h3>
        )}
        
        <div>
            {isNumbersVisible && randomNumbers.map((num, index) => (
                <span key={index}>{num} </span>
            ))}
        </div>


        {!isNumbersVisible && (
            <>
                <input
                    type="text"
                    value={userInputNumbers}
                    onChange={handleMemorizationInputChange}
                    placeholder="Ответ через пробел:"
                />
                <button className="button2" onClick={CheckMemorizationRes}>Проверить</button>
            </>
        )}
        
        {/* Отображение результата проверки */}
        {isMemorizationCorrect === true && <div className="round-change">Правильно!</div>}
        {isMemorizationCorrect === false && (
            <div className="round-change">Неправильно! Правильные числа: {randomNumbers.join(' ')}</div>
        )}
    </div>
)}

                        </>
                    )}
                </>
            )}
        </div>
        </>
    );
}

export default Level1;