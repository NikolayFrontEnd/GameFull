import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ownLevel.module.css';
const OwnLevel: React.FC = () => {
    // States for form inputs
    const [play, setPlay] = useState<boolean>(false);
    const [userInput111, setUserInput111] = useState<number | undefined>(undefined);
    const [userInput222, setUserInput222] = useState<number | undefined>(undefined);
    const [userInput333, setUserInput333] = useState<number | undefined>(undefined);
    const [userInput444, setUserInput444] = useState<number | undefined>(undefined);
    const [userInput555, setUserInput555] = useState<number | undefined>(undefined);
    const [userInput666, setUserInput666] = useState<number | undefined>(undefined);
    const [userInput777, setUserInput777] = useState<number | undefined>(undefined);
    const [userInput888, setUserInput888] = useState<number | undefined>(undefined);


    // Other states
    const [number, setNumber] = useState<number>(0);
    const [number2, setNumber2] = useState<number>(0);
    const [number3, setNumber3] = useState<number>(0);
    const [number4, setNumber4] = useState<number>(0);
    const [result, setResult] = useState<number>(0);
    const [userInput, setUserInput] = useState<string>('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [operation, setOperation] = useState<string>('+');
    const [currentTask, setCurrentTask] = useState<string>('none');
    const [round, setRound] = useState<number>(1);
    const [correctCount, setCorrectCount] = useState<number>(0);
    const [wrongCount, setWrongCount] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);

    const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
    const [userInputNumbers, setUserInputNumbers] = useState<string>('');
    const [isMemorizationCorrect, setIsMemorizationCorrect] = useState<boolean | null>(null);
    const [isNumbersVisible, setIsNumbersVisible] = useState<boolean>(false);
/*     const [isInputDisabled, setIsInputDisabled] = useState<boolean>(true); */

    // Timer
    const [timer, setTimer] = useState<number>(10);
    const [gameStarted, setGameStarted] = useState<boolean>(false);

    useEffect(() => {
        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 3000);
            return () => clearInterval(intervalId);
        } else {
            setGameStarted(true);
        }
    }, [timer]);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    const handleInputC = (event: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<number | undefined>>) => {
        setState(Number(event.target.value));
    };

    const handleMemorizationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInputNumbers(event.target.value);
    };
    const StartGame = (event: React.FormEvent) => {
        event.preventDefault();
        setPlay(true);
    };

    const changeNumber = (): number => {
        return userInput111 !== undefined && userInput222 !== undefined
            ? Math.floor(Math.random() * (userInput111 - userInput222 + 1)) + userInput222
            : 0;
    };

    const changeNumber2 = (): number => {
        return userInput333 !== undefined && userInput444 !== undefined
            ? Math.floor(Math.random() * (userInput333 - userInput444 + 1)) + userInput444
            : 0;
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
        const numbers = Array.from({ length: userInput777 || 1 }, () => Math.floor(Math.random() * 999));
        setRandomNumbers(numbers);
        setIsNumbersVisible(true);
        /* setIsInputDisabled(true); */
        setIsMemorizationCorrect(null);
        setUserInputNumbers('');
        setCurrentTask('memorization');

        setTimeout(() => {
            setIsNumbersVisible(false);
       /*      setIsInputDisabled(false); */
        }, (userInput666 || 5) * 1000);
    };

    const CheckArithmeticRes = () => {
        if (userInput !== '') {
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
        if (round < (userInput888 || 5)) {
 
                setRound((prev) => prev + 1);
                handleAnotherClick();
       
        } else {
            setGameOver(true);
        }
    }, (userInput555 || 2) * 1000);
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

    return (
        <>
            {!play ? (
                    <div className={styles.container}>     
<form onSubmit={StartGame} className={styles.form}>
    <h2 className={styles.title}>Настройки Игры</h2>

    {/* Настройки для сложения чисел */}
    <div className={styles.section}>
      <label className={styles.label}>
        Диапазон чисел для сложения:
      </label>

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>
          Максимальное число:
        </label>
        <input
         min="1"
          type="number"
          value={userInput111 || ''}
          onChange={(e) => handleInputC(e, setUserInput111)}
          placeholder="Например, 100"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>
          Минимальное число:
        </label>
        <input
         min="0"
          type="number"
          value={userInput222 || ''}
          onChange={(e) => handleInputC(e, setUserInput222)}
          placeholder="Например, 1"
          className={styles.input}
          required
        />
      </div>
    </div>

    {/* Настройки для умножения чисел */}
    <div className={styles.section}>
      <label className={styles.label}>
        Диапазон чисел для умножения:
      </label>

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>
          Максимальное число:
        </label>
        <input
          type="number"
           min="1"
          value={userInput333 || ''}
          onChange={(e) => handleInputC(e, setUserInput333)}
          placeholder="Например, 50"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>
          Минимальное число:
        </label>
        <input
          type="number"
           min="0"
          value={userInput444 || ''}
          onChange={(e) => handleInputC(e, setUserInput444)}
          placeholder="Например, 1"
          className={styles.input}
          required
        />
      </div>
    </div>

    {/* Время отдыха между раундами */}
    <div className={styles.section}>
      <label className={styles.label}>
        Время отдыха между раундами (секунды):
      </label>
      <input
        type="number"
         min="1"
        value={userInput555 || ''}
        onChange={(e) => handleInputC(e, setUserInput555)}
        placeholder="Например, 5"
        className={styles.input}
        required
      />
    </div>

    {/* Время на запоминание чисел */}
    <div className={styles.section}>
      <label className={styles.label}>
        Время на запоминание чисел (секунды):
      </label>
      <input
        type="number"
         min="0"
        value={userInput666 || ''}
        onChange={(e) => handleInputC(e, setUserInput666)}
        placeholder="Например, 10"
        className={styles.input}
        required
      />
    </div>

    {/* Количество чисел для запоминания */}
    <div className={styles.section}>
      <label className={styles.label}>
        Количество чисел для запоминания:
      </label>
      <input
        type="number"
         min="1"
        value={userInput777 || ''}
        onChange={(e) => handleInputC(e, setUserInput777)}
        placeholder="Например, 5"
        className={styles.input}
        required
      />
    </div>

    {/* Количество раундов */}
    <div className={styles.section}>
      <label className={styles.label}>
        Количество раундов:
      </label>
      <input
        type="number"
         min="1"
        value={userInput888 || ''}
        onChange={(e) => handleInputC(e, setUserInput888)}
        placeholder="Например, 10"
        className={styles.input}
        required
      />
    </div>

    {/* Кнопки управления */}
    <div className={styles.buttonGroup}>
      <button type="submit" className={styles.button}>
        Начать игру!
      </button>
      <Link to="/main">
        <button type="button" className={styles.button}>
          Назад
        </button>
      </Link> 
    </div>
  </form>
        </div>
            ) : (
                <div className="container2">
                {!gameStarted ? (
                    <h2 className="round-change">До начала игры осталось: {timer}</h2>
                ) : (
                    <>
                        <h2 className="round-change">Свой Уровень </h2>
                        <div className="round-change">Раунд: {round} из {userInput888}</div>
                        {gameOver ? (
                            <div>
                                <h3 className="round-change">Игра окончена!</h3>
                                <p className="round-change">Правильных ответов: {correctCount}</p>
                                <p className="round-change">Неправильных ответов: {wrongCount}</p>
                                <Link to ="/main"><button className = "button2" >Вернуться</button></Link>  
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
            )}
        </>
    );
};

export default OwnLevel;

