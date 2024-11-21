import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const Level4: React.FC = () => {
    // Состояния для генерации чисел
    const [number, setNumber] = useState<number>(0);
    const [number2, setNumber2] = useState<number>(0);
    const [number3, setNumber3] = useState<number>(0);
    const [number4, setNumber4] = useState<number>(0);
    
    // Состояния для результатов и операций
    const [result, setResult] = useState<number>(0);
    const [operation, setOperation] = useState<string>('+');
    
    // Состояния для управления игрой
    const [userInput, setUserInput] = useState<string>(''); // Для арифметических раундов
    const [recallInput, setRecallInput] = useState<string>(''); // Для recall раундов
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [currentTask, setCurrentTask] = useState<'arithmetic' | 'recall' | 'none'>('none');
    const [round, setRound] = useState<number>(1);
    const [correctCount, setCorrectCount] = useState<number>(0);
    const [wrongCount, setWrongCount] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [previousAnswers, setPreviousAnswers] = useState<number[]>([]);
    const [timer, setTimer] = useState<number>(10);
    const [gameStarted, setGameStarted] = useState<boolean>(false);

    // Временный массив для хранения ответов при неправильных вводах
   // const [temporaryData, setTemporaryData] = useState<number[]>([])
//const[num, SetNum] = useState<number>(0);
    // Определение, является ли раунд арифметическим или recall
    const isArithmeticRound = (round: number) => [1, 3, 5, 7].includes(round);
    const isRecallRound = (round: number) => [2, 4, 6, 8].includes(round);

    // Таймер обратного отсчёта перед началом игры
    useEffect(() => {
        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000); // Секундный интервал
            return () => clearInterval(intervalId);
        } else {
            setGameStarted(true);
            setCurrentTask('arithmetic');
            generateArithmeticTask();
        }
    }, [timer]);

    // Функция генерации арифметического задания
    const generateArithmeticTask = () => {
        const operations = ['+', '-', '*'];
        const randomOperation = operations[Math.floor(Math.random() * operations.length)];

        let num1: number, num2: number, res: number;

        if (randomOperation === '*') {
            // Для умножения используем другой диапазон
            num1 = changeNumber2();
            num2 = changeNumber2();
            res = num1 * num2;
            setNumber3(num1);
            setNumber4(num2);
        } else {
            // Для сложения и вычитания
            num1 = changeNumber();
            num2 = changeNumber();
            if (randomOperation === '+') {
                res = num1 + num2;
            } else {
                res = num1 - num2;
            }
            setNumber(num1);
            setNumber2(num2);
        }

        setOperation(randomOperation);
        setResult(res);
        setIsCorrect(null);
        setUserInput('');
        setCurrentTask('arithmetic');
    };

    // Генерация числа для сложения и вычитания (1111-9999)
    const changeNumber = (): number => {
        return Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;
    };

    // Генерация числа для умножения (32-99)
    const changeNumber2 = (): number => {
        return Math.floor(Math.random() * (99 - 32 + 1)) + 32;
    };

    // Обработка ввода для арифметических раундов
    const handleArithmeticInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    // Проверка ответа в арифметическом раунде
    const checkArithmeticResult = () => {
        const userAnswer = Number(userInput);
        if (isNaN(userAnswer)) {
            setIsCorrect(false);
            setWrongCount(prev => prev + 1);
            proceedToNextRound();
            return;
        }

        const isAnswerCorrect = userAnswer === result;
        setIsCorrect(isAnswerCorrect);

        if (isAnswerCorrect) {
            setCorrectCount(prev => prev + 1);
        } else {
            setWrongCount(prev => prev + 1);
        }

        // Сохранение правильного ответа
        setPreviousAnswers(prev => [...prev, result]);

        proceedToNextRound();
    };

    // Переход к следующему раунду
    const proceedToNextRound = () => {
        setTimeout(() => {
            setIsCorrect(null);
            setRound(prev => prev + 1);

            const nextRound = round + 1;
            setRecallInput(''); 
            if (nextRound > 8) {
                setGameOver(true);
                // Очистка сохранённых ответов после завершения игры
                setPreviousAnswers([]);

            } else if (isRecallRound(nextRound)) {
                // Переход к recall раунду
                setCurrentTask('recall');

            } else if (isArithmeticRound(nextRound)) {

                // Генерация задания для арифметических раундов
                generateArithmeticTask();
            }

            // Дополнительная очистка temporaryData не требуется здесь
        }, 4000); // Задержка 4 секунды для отображения результата
    };

    // Обработка ввода для recall раундов
    const handleRecallInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRecallInput(event.target.value);
    };

    // Проверка ответов в recall раунде
    const checkRecallRound = () => {
        // Разделяем ввод по пробелу или запятой и преобразуем в числа
        const inputs = recallInput.split(/[\s,]+/).map(item => parseInt(item, 10));

        // Проверка количества и валидности введённых чисел
        if (inputs.length !== 1 || inputs.some(num => isNaN(num))) {
            setIsCorrect(false);
            setWrongCount(prev => prev + 1);
            proceedToNextRound();
            return;
        }

        // Проверка соответствия введённых чисел сохранённым ответам независимо от порядка
        const allCorrect = inputs.every(input => previousAnswers.slice(-1).includes(input)) && previousAnswers.slice(-1).length === inputs.length;


        if (allCorrect) {
            setIsCorrect(true);
            setCorrectCount(prev => prev + 1);
        } else {
            setIsCorrect(false);
            setWrongCount(prev => prev + 1);
        }

        proceedToNextRound();
    };

    interface GameResult {
        score: number;
        success: number;
        unsuccess: number;
      }
    
      const sendGameResult = async (token: string, correct: number, wrong: number) => {
        // Вычисление score на основе количества правильных ответов
        const score = correct > 5 ? 10 : 0;
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
        <div className="container2">
            {!gameStarted ? (
                <h2 className="round-change">До начала игры осталось: {timer} сек</h2>
            ) : (
                <>
                    <h2 className="round-change">Уровень 4</h2>

                    {gameOver ? (
                        <div>
                            <h3 className="round-change">Игра окончена!</h3>
                            <p className="round-change">Правильных ответов: {correctCount}</p>
                            <p className="round-change">Неправильных ответов: {wrongCount}</p>
                            <Link to ="/main"><button onClick = {handleSendResult} className = "button2" >Вернуться</button></Link>  
                        </div>
                    ) : (
                        <>
                            <div className="round-change">Раунд: {round} из 8 </div>

                            {currentTask === 'recall' ? (
                                <div>
                                    <p>Введите правильный ответ из предыдущего  раунда:</p>
                                    <input
                                        type="text"
                                        value={recallInput}
                                        onChange={handleRecallInputChange}
                                        placeholder="Введите:"
                                    />
                                    <button className="button2" onClick={checkRecallRound}>
                                        Проверить
                                    </button>
                                    {isCorrect === true && (
                                        <div className="round-change">Правильно!</div>
                                    )}
                                    {isCorrect === false && (
                                        <div className="round-change">
                                     Неправильно! Правильные ответы: {previousAnswers.slice(-1)}

                                        </div>
                                    )}
                                </div>
                            ) : (
                                currentTask === 'arithmetic' && (
                                    <div className="round-change">
                                        <div>
                                            {operation === '*' 
                                                ? `${number3} ${operation} ${number4} = ?`
                                                : `${number} ${operation} ${number2} = ?`}
                                        </div>
                                        <input
                                            type="number"
                                            value={userInput}
                                            onChange={handleArithmeticInputChange}
                                        />
                                        <button className="button2" onClick={checkArithmeticResult}>
                                            Проверить
                                        </button>
                                        {isCorrect === true && (
                                            <div className="round-change">
                                                Правильно! Запомни правильный ответ для следующего раунда!
                                            </div>
                                        )}
                                        {isCorrect === false && (
                                            <div className="round-change">
                                                Неправильно! Правильный ответ: {result}. Запомни это число для следующего раунда!
                                            </div>
                                        )}
                                    </div>
                                )
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Level4;
