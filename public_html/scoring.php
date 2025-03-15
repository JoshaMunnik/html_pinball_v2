<?php
// config
$server = 'localhost';
$database = 'u93785p208679_pinball';
$user = 'u93785p208679_pinball';
$password = ')WI(`^H?n&b>a)ikq_8Gh|u@VdSX(Gu1';

// always returning json
header('Content-Type: application/json; charset=utf-8');
try {
  // connect
  $connection = new PDO("mysql:host=$server;dbname=$database", $user, $password);
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // store new score if any
  if (isset($_POST['score']) && isset($_POST['hash'])) {
    $score = (int) $_POST['score'];
    $hash = (int) $_POST['hash'];

    if (($score > 0) && ($score < 999999) && ($score % 5 === 0) && ((($hash & 0xFFFFF000) >> 12) == ($score & 0xFFFFF))) {
      $newScore = [
        'score' => $_POST['score'],
        'created' => date('Y-m-d H:i:s')
      ];

      $sql = sprintf(
        'INSERT INTO %s (%s) values (%s)',
        'scores',
        implode(', ', array_keys($newScore)),
        ':'.implode(', :', array_keys($newScore))
      );

      $statement = $connection->prepare($sql);
      $statement->execute($newScore);
    }
  }

  // return highest score
  $statement = $connection->prepare('SELECT score FROM scores ORDER BY score DESC LIMIT 1');
  $result = $statement->execute();
  $highscore = $statement->fetchColumn();

  echo json_encode([
    'success' => true,
    'highscore' => $highscore !== false ? $highscore : 0
  ]);
}
catch(Exception $exception) {
  echo json_encode([
    'success' => false,
    'message' => $exception->getMessage()
  ]);
}